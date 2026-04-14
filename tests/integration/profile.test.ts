import request from "supertest";
import app from "../../src/app";
import { cleanupTestData, createTestUser, TestUser } from "../helpers/db.helper";
import { generateAccessToken } from "../helpers/auth.helper";

describe("Profile Routes", () => {
  let testUser: TestUser;
  let userToken: string;
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    testUser = await createTestUser();
    createdUserIds.push(testUser.id);

    userToken = generateAccessToken({
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
      role: "USER",
    });
  });

  afterAll(async () => {
    await cleanupTestData(createdUserIds);
  });

  describe("GET /api/v1/my-profile", () => {
    it("returns authenticated user profile", async () => {
      const res = await request(app)
        .get("/api/v1/my-profile")
        .set("Authorization", userToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.userProfile).toBeDefined();
      expect(res.body.data).not.toHaveProperty("password");
    });

    it("returns 401 when no Authorization header is provided", async () => {
      const res = await request(app).get("/api/v1/my-profile");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/v1/my-profile", () => {
    it("updates user contact number successfully", async () => {
      const res = await request(app)
        .put("/api/v1/my-profile")
        .set("Authorization", userToken)
        .send({ user: { contactNumber: "01712345678" } });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("updates userProfile bio and age successfully", async () => {
      const res = await request(app)
        .put("/api/v1/my-profile")
        .set("Authorization", userToken)
        .send({ userProfile: { bio: "I am a regular donor", age: 25 } });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 when availability is not a boolean", async () => {
      const res = await request(app)
        .put("/api/v1/my-profile")
        .set("Authorization", userToken)
        .send({ user: { availability: "yes" } });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when no Authorization header is provided", async () => {
      const res = await request(app)
        .put("/api/v1/my-profile")
        .send({ user: { contactNumber: "01712345678" } });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/donor-details/:donorId", () => {
    it("returns donor profile for a valid donor ID", async () => {
      const res = await request(app).get(
        `/api/v1/donor-details/${testUser.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testUser.id);
      expect(res.body.data.userProfile).toBeDefined();
    });

    it("returns non-200 for a non-existent donor ID", async () => {
      const res = await request(app).get(
        "/api/v1/donor-details/00000000-0000-0000-0000-000000000000"
      );

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});
