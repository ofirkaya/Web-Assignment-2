import request from "supertest";
import initApp from "../src/app";
import { connectTestDb, closeTestDb, clearTestDb } from "./setup";
import User from "../src/models/userModel";

let app: any;

beforeAll(async () => {
  await connectTestDb();
  app = await initApp();
});

afterAll(async () => {
  await closeTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

describe("Posts API", () => {
  it("POST /post -> 201 creates post", async () => {
    const user = await User.create({ email: "a@a.com", password: "123456" });

    const res = await request(app).post("/post").send({
      message: "hello",
      sender: user._id.toString(),
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("message", "hello");
    expect(res.body).toHaveProperty("sender");
  });

  it("GET /post -> 200 returns array", async () => {
    const res = await request(app).get("/post");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /post/:id -> 404 when ObjectId format is valid but not found", async () => {
    const res = await request(app).get("/post/65a1f0f3a9c2b2a1c1234567");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Data not found");
  });

  it("GET /post/:id -> 500 when id format is invalid", async () => {
    const res = await request(app).get("/post/123");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /post -> 500 when missing required fields (mongoose validation)", async () => {
    const res = await request(app).post("/post").send({
      // message missing
      sender: "65a1f0f3a9c2b2a1c1234567",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
