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

describe("Users API", () => {
    it("GET /user -> 200 returns array", async () => {
        const res = await request(app).get("/user");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("GET /user/:id -> 200 returns user", async () => {
        const user = await User.create({ email: "test@test.com", password: "123456" });
        const res = await request(app).get(`/user/${user._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "test@test.com");
    });

    it("GET /user/:id -> 404 when not found", async () => {
        const res = await request(app).get("/user/65a1f0f3a9c2b2a1c1234567");
        expect(res.status).toBe(404);
    });

    it("PUT /user/:id -> 200 updates user", async () => {
        const user = await User.create({ email: "old@test.com", password: "123456" });
        const res = await request(app).put(`/user/${user._id}`).send({
            email: "new@test.com",
            imgUrl: "http://example.com/img.png"
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "new@test.com");
        expect(res.body).toHaveProperty("imgUrl", "http://example.com/img.png");
    });

    it("DELETE /user/:id -> 200 deletes user", async () => {
        const user = await User.create({ email: "del@test.com", password: "123456" });
        const res = await request(app).delete(`/user/${user._id}`);
        expect(res.status).toBe(200);

        const check = await request(app).get(`/user/${user._id}`);
        expect(check.status).toBe(404);
    });

    it("GET /user/:id -> 500 when invalid id format", async () => {
        const res = await request(app).get("/user/123");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});
