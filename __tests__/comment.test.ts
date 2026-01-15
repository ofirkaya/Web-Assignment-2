import request from "supertest";
import initApp from "../src/app";
import { connectTestDb, closeTestDb, clearTestDb } from "./setup";
import User from "../src/models/userModel";
import Post from "../src/models/postModel";

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

describe("Comments API", () => {
  it("POST /comment -> 201 creates comment", async () => {
    const user = await User.create({ email: "c@c.com", password: "123456" });
    const post = await Post.create({ message: "post1", sender: user._id });

    const res = await request(app).post("/comment").send({
      post: post._id.toString(),
      sender: user._id.toString(),
      message: "nice!",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("message", "nice!");
    expect(res.body).toHaveProperty("post");
    expect(res.body).toHaveProperty("sender");
  });

  it("GET /comment -> 200 returns array", async () => {
    const res = await request(app).get("/comment");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /comment/:id -> 404 when valid ObjectId but not found", async () => {
    const res = await request(app).get("/comment/65a1f0f3a9c2b2a1c1234567");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Data not found");
  });

  it("DELETE /comment/:id -> 404 when valid ObjectId but not found", async () => {
    const res = await request(app).delete("/comment/65a1f0f3a9c2b2a1c1234567");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Data not found");
  });

  it("GET /comment/:id -> 500 when invalid id format", async () => {
    const res = await request(app).get("/comment/123");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /comment -> 500 when missing required fields", async () => {
    const res = await request(app).post("/comment").send({
      message: "hi",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
