<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Activity,
  Bolt,
  CheckCircle2,
  Gauge,
  RadioTower,
  RefreshCcw,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-vue-next";
import {
  calculateFleetSummary,
  type DispatchEvent,
  type FleetSummary,
  type GridAsset,
  type TelemetryReading,
} from "@grid-ops/shared";
import { api, demoAssets, demoTelemetry } from "./services/api";
import { formatKw, formatTimeAgo } from "./services/formatters";

const assets = ref<GridAsset[]>([]);
const summary = ref<FleetSummary | null>(null);
const telemetry = ref<TelemetryReading[]>([]);
const events = ref<DispatchEvent[]>([]);
const selectedAssetId = ref("asset-battery-04");
const targetKw = ref(1850);
const durationSeconds = ref(300);
const loading = ref(true);
const dispatching = ref(false);
const apiStatus = ref<"connected" | "demo">("connected");

const selectedAsset = computed(() =>
  assets.value.find((asset) => asset.id === selectedAssetId.value),
);

const fleetSummary = computed(
  () => summary.value ?? calculateFleetSummary(assets.value),
);

const telemetryPath = computed(() => {
  if (telemetry.value.length === 0) {
    return "";
  }

  const values = [...telemetry.value].reverse();
  const max = Math.max(...values.map((reading) => reading.powerKw));
  const min = Math.min(...values.map((reading) => reading.powerKw));
  const range = Math.max(max - min, 1);

  return values
    .map((reading, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 90 - ((reading.powerKw - min) / range) * 72;
      return `${x},${y}`;
    })
    .join(" ");
});

const availabilityPercent = computed(() => {
  if (fleetSummary.value.totalCapacityKw === 0) {
    return 0;
  }

  return Math.round(
    (fleetSummary.value.availableKw / fleetSummary.value.totalCapacityKw) * 100,
  );
});

const loadDashboard = async () => {
  loading.value = true;

  try {
    const [assetResult, summaryResult, eventResult] = await Promise.all([
      api.assets(),
      api.summary(),
      api.dispatchEvents(),
    ]);
    assets.value = assetResult;
    summary.value = summaryResult;
    events.value = eventResult;
    selectedAssetId.value = assetResult[0]?.id ?? selectedAssetId.value;
    telemetry.value = await api.telemetry(selectedAssetId.value);
    apiStatus.value = "connected";
  } catch {
    assets.value = demoAssets;
    summary.value = calculateFleetSummary(demoAssets);
    events.value = [];
    telemetry.value = demoTelemetry(selectedAssetId.value);
    apiStatus.value = "demo";
  } finally {
    loading.value = false;
  }
};

const selectAsset = async (assetId: string) => {
  selectedAssetId.value = assetId;

  try {
    telemetry.value = await api.telemetry(assetId);
  } catch {
    telemetry.value = demoTelemetry(assetId);
  }
};

const submitDispatch = async () => {
  dispatching.value = true;

  try {
    const event = await api.createDispatch(targetKw.value, durationSeconds.value);
    events.value = [event, ...events.value];
    await loadDashboard();
  } catch {
    events.value = [
      {
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        targetKw: targetKw.value,
        durationSeconds: durationSeconds.value,
        status: "queued",
        selectedAssetIds: assets.value.slice(0, 2).map((asset) => asset.id),
      },
      ...events.value,
    ];
    apiStatus.value = "demo";
  } finally {
    dispatching.value = false;
  }
};

onMounted(() => {
  void loadDashboard();
});
</script>

<template>
  <main class="shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark"><Zap :size="22" /></span>
        <div>
          <strong>Grid Ops</strong>
          <span>Flexibility Control</span>
        </div>
      </div>
      <nav aria-label="Primary">
        <a class="nav-item active" href="#fleet"><Gauge :size="18" />Fleet</a>
        <a class="nav-item" href="#dispatch"><Send :size="18" />Dispatch</a>
        <a class="nav-item" href="#telemetry"><Activity :size="18" />Telemetry</a>
      </nav>
      <div class="sidebar-status">
        <ShieldCheck :size="18" />
        <span>Runtime checks passing</span>
      </div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">Real-time operations</p>
          <h1>Distributed energy response console</h1>
        </div>
        <div class="topbar-actions">
          <span class="status-pill" :class="apiStatus">
            <CheckCircle2 :size="16" />
            {{ apiStatus === "connected" ? "API connected" : "Demo data" }}
          </span>
          <button class="icon-button" type="button" title="Refresh" @click="loadDashboard">
            <RefreshCcw :size="18" />
          </button>
        </div>
      </header>

      <section id="fleet" class="metrics" aria-label="Fleet summary">
        <article>
          <span><Bolt :size="18" />Available</span>
          <strong>{{ formatKw(fleetSummary.availableKw) }} kW</strong>
          <small>{{ availabilityPercent }}% of fleet capacity</small>
        </article>
        <article>
          <span><RadioTower :size="18" />Online assets</span>
          <strong>{{ fleetSummary.onlineAssets }}</strong>
          <small>{{ fleetSummary.respondingAssets }} responding now</small>
        </article>
        <article>
          <span><Gauge :size="18" />Avg response</span>
          <strong>{{ fleetSummary.averageResponseTimeMs }} ms</strong>
          <small>Fastest assets prioritized</small>
        </article>
      </section>

      <section class="content-grid">
        <section class="panel asset-panel" aria-labelledby="assets-heading">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Fleet</p>
              <h2 id="assets-heading">Asset readiness</h2>
            </div>
          </div>
          <div class="asset-table">
            <button
              v-for="asset in assets"
              :key="asset.id"
              class="asset-row"
              :class="{ selected: asset.id === selectedAssetId }"
              type="button"
              @click="selectAsset(asset.id)"
            >
              <span>
                <strong>{{ asset.name }}</strong>
                <small>{{ asset.site }} · {{ asset.region }}</small>
              </span>
              <span class="status" :class="asset.status">{{ asset.status }}</span>
              <span>{{ formatKw(asset.availableKw) }} kW</span>
              <span>{{ asset.responseTimeMs }} ms</span>
            </button>
          </div>
        </section>

        <section id="dispatch" class="panel dispatch-panel" aria-labelledby="dispatch-heading">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Dispatch</p>
              <h2 id="dispatch-heading">Flexibility event</h2>
            </div>
          </div>
          <form class="dispatch-form" @submit.prevent="submitDispatch">
            <label>
              Target kW
              <input v-model.number="targetKw" min="1" max="10000" type="number" />
            </label>
            <label>
              Duration
              <select v-model.number="durationSeconds">
                <option :value="120">2 minutes</option>
                <option :value="300">5 minutes</option>
                <option :value="900">15 minutes</option>
                <option :value="1800">30 minutes</option>
              </select>
            </label>
            <button class="primary-button" type="submit" :disabled="dispatching">
              <Send :size="18" />
              {{ dispatching ? "Dispatching" : "Start event" }}
            </button>
          </form>

          <div class="event-list">
            <p v-if="events.length === 0" class="empty-state">No dispatch events yet.</p>
            <article v-for="event in events.slice(0, 4)" :key="event.id" class="event-row">
              <span class="status" :class="event.status">{{ event.status }}</span>
              <strong>{{ formatKw(event.targetKw) }} kW</strong>
              <small>{{ event.selectedAssetIds.length }} assets · {{ event.durationSeconds }}s</small>
            </article>
          </div>
        </section>

        <section id="telemetry" class="panel telemetry-panel" aria-labelledby="telemetry-heading">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Telemetry</p>
              <h2 id="telemetry-heading">{{ selectedAsset?.name ?? "Asset telemetry" }}</h2>
            </div>
            <span v-if="selectedAsset">{{ formatTimeAgo(selectedAsset.lastSeen) }}</span>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="sparkline" role="img">
            <polyline :points="telemetryPath" />
          </svg>
          <div class="telemetry-list">
            <article v-for="reading in telemetry.slice(0, 4)" :key="reading.timestamp">
              <span>{{ reading.frequencyHz }} Hz</span>
              <span>{{ reading.voltage }} V</span>
              <span>{{ reading.powerKw }} kW</span>
              <span>{{ reading.temperatureC }} C</span>
            </article>
          </div>
        </section>
      </section>

      <p v-if="loading" class="loading">Refreshing operational state...</p>
    </section>
  </main>
</template>

