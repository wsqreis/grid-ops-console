import { describe, expect, it } from "vitest";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./app.module.js";

describe("AppModule", () => {
  it("serves fleet endpoints through Nest dependency injection", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app: INestApplication = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    await app.init();

    const server = app.getHttpServer();
    await request(server).get("/api/health").expect(200);
    const assetsResponse = await request(server).get("/api/assets").expect(200);
    const summaryResponse = await request(server)
      .get("/api/assets/summary")
      .expect(200);

    expect(assetsResponse.body).toHaveLength(4);
    expect(summaryResponse.body.availableKw).toBeGreaterThan(0);

    await app.close();
  });
});
