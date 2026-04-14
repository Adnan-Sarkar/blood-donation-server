import request from "supertest";
import app from "../../src/app";

describe("Health & Root Routes", () => {
  it("GET /health returns server health with redis unconfigured", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Server is healthy");
    expect(res.body.redis.status).toBe("unconfigured");
  });

  it("GET / returns welcome message", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Welcome to Blood Donation api");
  });

  it("GET /api/does-not-exist returns 404", async () => {
    const res = await request(app).get("/api/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
