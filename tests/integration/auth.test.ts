import request from "supertest";
import app from "../../src/app";
import {
  cleanupTestData,
  createTestUser,
  TestUser,
} from "../helpers/db.helper";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/auth.helper";

describe("Auth Routes", () => {
  const createdUserIds: string[] = [];

  afterAll(async () => {
    await cleanupTestData(createdUserIds);
  });

  describe("POST /api/v1/register", () => {
    it("creates a new user with valid payload and returns 201", async () => {
      const payload = {
        name: "Auth Test User",
        email: `auth-reg-${Date.now()}@example.com`,
        password: "Password@123",
        bloodType: "A_POSITIVE",
        gender: "MALE",
        location: "Dhaka",
      };

      const res = await request(app).post("/api/v1/register").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(payload.email);
      expect(res.body.data).not.toHaveProperty("password");
      expect(res.body.data.userProfile).toBeDefined();

      createdUserIds.push(res.body.data.id);
    });

    it("returns 400 when email is missing", async () => {
      const res = await request(app).post("/api/v1/register").send({
        name: "No Email",
        password: "Password@123",
        bloodType: "A_POSITIVE",
        gender: "MALE",
        location: "Dhaka",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 when password is missing", async () => {
      const res = await request(app)
        .post("/api/v1/register")
        .send({
          name: "No Pass",
          email: `no-pass-${Date.now()}@example.com`,
          bloodType: "A_POSITIVE",
          gender: "MALE",
          location: "Dhaka",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 for invalid bloodType enum value", async () => {
      const res = await request(app)
        .post("/api/v1/register")
        .send({
          name: "Bad Blood",
          email: `bad-blood-${Date.now()}@example.com`,
          password: "Password@123",
          bloodType: "INVALID_TYPE",
          gender: "MALE",
          location: "Dhaka",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/login", () => {
    let testUser: TestUser;
    const plainPassword = "LoginTest@123";

    beforeAll(async () => {
      testUser = await createTestUser({ password: plainPassword });
      createdUserIds.push(testUser.id);
    });

    it("returns access token and sets refresh token as HTTP-only cookie on valid credentials", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: testUser.email,
        password: plainPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data).not.toHaveProperty("refreshToken");
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"][0]).toContain("refreshToken=");
      expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
    });

    it("returns 400 on wrong password", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: testUser.email,
        password: "WrongPassword@123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 on non-existent email", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: "nobody-at-all@example.com",
        password: "SomePass@123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 when email field is missing", async () => {
      const res = await request(app).post("/api/v1/login").send({
        password: "Password@123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/refresh-token", () => {
    it("returns new access token when valid refresh token cookie is present", async () => {
      const user = await createTestUser();
      createdUserIds.push(user.id);

      const refreshToken = generateRefreshToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "USER",
      });

      const res = await request(app)
        .post("/api/v1/auth/refresh-token")
        .set("Cookie", `refreshToken=${refreshToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it("returns 401 when no refresh token cookie is present", async () => {
      const res = await request(app).post("/api/v1/auth/refresh-token");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when refresh token is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh-token")
        .set("Cookie", "refreshToken=invalid.jwt.token");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/change-password", () => {
    it("changes password successfully with correct old password", async () => {
      const plainPassword = "OldPass@123";
      const user = await createTestUser({ password: plainPassword });
      createdUserIds.push(user.id);

      const token = generateAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "USER",
      });

      const res = await request(app)
        .post("/api/v1/auth/change-password")
        .set("Authorization", token)
        .send({ oldPassword: plainPassword, newPassword: "NewPass@123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 when old password is incorrect", async () => {
      const user = await createTestUser();
      createdUserIds.push(user.id);

      const token = generateAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "USER",
      });

      const res = await request(app)
        .post("/api/v1/auth/change-password")
        .set("Authorization", token)
        .send({ oldPassword: "WrongOldPass@123", newPassword: "NewPass@123" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when Authorization header is missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/change-password")
        .send({ oldPassword: "Old@123", newPassword: "New@123" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 when newPassword field is missing", async () => {
      const user = await createTestUser();
      createdUserIds.push(user.id);

      const token = generateAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "USER",
      });

      const res = await request(app)
        .post("/api/v1/auth/change-password")
        .set("Authorization", token)
        .send({ oldPassword: "Old@123" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
