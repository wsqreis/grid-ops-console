import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./app.module.js";

test("AppModule serves fleet endpoints through Nest dependency injection", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.setGlobalPrefix("api");
  await app.init();

  try {
    const server = app.getHttpServer();
    await request(server).get("/api/health").expect(200);
    const assetsResponse = await request(server).get("/api/assets").expect(200);
    const summaryResponse = await request(server)
      .get("/api/assets/summary")
      .expect(200);

    assert.equal(assetsResponse.body.length, 4);
    assert.ok(summaryResponse.body.availableKw > 0);
  } finally {
    await app.close();
  }
});
