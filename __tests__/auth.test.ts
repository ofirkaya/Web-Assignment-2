import request from "supertest";
import initApp from "../src/app";
import { connectTestDb, clearTestDb, closeTestDb } from "./setup";

let app: any;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test_refresh_secret";
  process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

  await connectTestDb();
  app = await initApp();
});

afterAll(async () => {
  await closeTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

const registerUser = async (email = "user@test.com", password = "123456", imgUrl?: string) => {
  const payload: any = { email, password };
  if (imgUrl) payload.imgUrl = imgUrl;

  return request(app).post("/auth/register").send(payload);
};

describe("Auth API", () => {
  it("POST /auth/register -> 201 creates user and returns tokens", async () => {
    const res = await registerUser("a@a.com", "123456", "http://img.com/a.png");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("email", "a@a.com");
    expect(res.body).toHaveProperty("imgUrl", "http://img.com/a.png");
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    expect(typeof res.body.accessToken).toBe("string");
    expect(typeof res.body.refreshToken).toBe("string");
  });

  it("POST /auth/register -> 406 when email already exists", async () => {
    await registerUser("dup@a.com", "123456");
    const res2 = await registerUser("dup@a.com", "123456");

    expect(res2.status).toBe(406);
  });

  it("POST /auth/login -> 200 returns tokens for valid credentials", async () => {
    await registerUser("login@a.com", "123456");

    const res = await request(app).post("/auth/login").send({
      email: "login@a.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(typeof res.body.accessToken).toBe("string");
    expect(typeof res.body.refreshToken).toBe("string");
  });

  it("POST /auth/login -> 401 for wrong password", async () => {
    await registerUser("wrong@a.com", "123456");

    const res = await request(app).post("/auth/login").send({
      email: "wrong@a.com",
      password: "badpass",
    });

    expect(res.status).toBe(401);
  });

  it("GET /auth/refresh -> 200 returns new tokens when refresh token is valid", async () => {
    const reg = await registerUser("refresh@a.com", "123456");
    const oldRefresh = reg.body.refreshToken as string;

    const res = await request(app)
      .get("/auth/refresh")
      .set("Authorization", `Bearer ${oldRefresh}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    expect(res.body.refreshToken).not.toBe(oldRefresh);
  });

  it("GET /auth/refresh -> 401 when refresh token is missing", async () => {
    const res = await request(app).get("/auth/refresh");
    expect(res.status).toBe(401);
  });

  it("GET /auth/logout -> 200 on valid refresh token, then 401 if reused", async () => {
    const reg = await registerUser("logout@a.com", "123456");
    const refreshToken = reg.body.refreshToken as string;

    const res1 = await request(app)
      .get("/auth/logout")
      .set("Authorization", `Bearer ${refreshToken}`);

    expect(res1.status).toBe(200);

    const res2 = await request(app)
      .get("/auth/logout")
      .set("Authorization", `Bearer ${refreshToken}`);

    expect(res2.status).toBe(401);
  });

  it("GET /auth/logout -> 401 when Authorization missing", async () => {
    const res = await request(app).get("/auth/logout");
    expect(res.status).toBe(401);
  });
});
