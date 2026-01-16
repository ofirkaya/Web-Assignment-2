import request from "supertest";
import initApp from "../src/app";
import { connectTestDb, closeTestDb } from "./setup";

let app: any;

beforeAll(async () => {
  await connectTestDb();
  app = await initApp();
});

afterAll(async () => {
  await closeTestDb();
});

describe("Smoke Test", () => {
  it("GET /api-docs should return 200", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.status).toBe(200);
  });
});
