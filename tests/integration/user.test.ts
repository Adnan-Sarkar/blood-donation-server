import request from "supertest";
import app from "../../src/app";
import {
  cleanupTestData,
  createTestAdmin,
  createTestUser,
  TestUser,
} from "../helpers/db.helper";
import { generateAccessToken } from "../helpers/auth.helper";

describe("User Routes", () => {
  let admin: TestUser;
  let regularUser: TestUser;
  let adminToken: string;
  let userToken: string;
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    admin = await createTestAdmin();
    regularUser = await createTestUser();
    createdUserIds.push(admin.id, regularUser.id);

    adminToken = generateAccessToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "ADMIN",
    });

    userToken = generateAccessToken({
      id: regularUser.id,
      name: regularUser.name,
      email: regularUser.email,
      role: "USER",
    });
  });

  afterAll(async () => {
    await cleanupTestData(createdUserIds);
  });

  describe("GET /api/v1/users", () => {
    it("returns paginated user list for ADMIN role", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", adminToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("returns 403 when USER role tries to access admin endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", userToken);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app).get("/api/v1/users");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/v1/users/:userId", () => {
    it("allows ADMIN to change user status to INACTIVE", async () => {
      const targetUser = await createTestUser();
      createdUserIds.push(targetUser.id);

      const res = await request(app)
        .put(`/api/v1/users/${targetUser.id}`)
        .set("Authorization", adminToken)
        .send({ status: "INACTIVE" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("allows ADMIN to change user status to BLOCKED", async () => {
      const targetUser = await createTestUser();
      createdUserIds.push(targetUser.id);

      const res = await request(app)
        .put(`/api/v1/users/${targetUser.id}`)
        .set("Authorization", adminToken)
        .send({ status: "BLOCKED" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 403 when USER role tries to change another user status", async () => {
      const targetUser = await createTestUser();
      createdUserIds.push(targetUser.id);

      const res = await request(app)
        .put(`/api/v1/users/${targetUser.id}`)
        .set("Authorization", userToken)
        .send({ status: "INACTIVE" });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app)
        .put(`/api/v1/users/${regularUser.id}`)
        .send({ status: "INACTIVE" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
