import request from "supertest";
import app from "../../src/app";
import {
  cleanupTestData,
  createTestAdmin,
  createTestUser,
  TestUser,
} from "../helpers/db.helper";
import { generateAccessToken } from "../helpers/auth.helper";

describe("Meta Routes", () => {
  let regularUser: TestUser;
  let admin: TestUser;
  let userToken: string;
  let adminToken: string;
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    regularUser = await createTestUser();
    admin = await createTestAdmin();
    createdUserIds.push(regularUser.id, admin.id);

    userToken = generateAccessToken({
      id: regularUser.id,
      name: regularUser.name,
      email: regularUser.email,
      role: "USER",
    });

    adminToken = generateAccessToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "ADMIN",
    });
  });

  afterAll(async () => {
    await cleanupTestData(createdUserIds);
  });

  describe("GET /api/v1/meta-data", () => {
    it("returns user meta stats for USER role", async () => {
      const res = await request(app)
        .get("/api/v1/meta-data")
        .set("Authorization", userToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it("returns 403 when ADMIN role accesses user-only endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/meta-data")
        .set("Authorization", adminToken);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app).get("/api/v1/meta-data");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/meta-data/admin", () => {
    it("returns admin meta stats for ADMIN role", async () => {
      const res = await request(app)
        .get("/api/v1/meta-data/admin")
        .set("Authorization", adminToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it("returns 403 when USER role accesses admin endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/meta-data/admin")
        .set("Authorization", userToken);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app).get("/api/v1/meta-data/admin");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
