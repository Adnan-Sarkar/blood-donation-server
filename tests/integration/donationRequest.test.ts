import request from "supertest";
import app from "../../src/app";
import {
  cleanupTestData,
  createTestAdmin,
  createTestDonationRequest,
  createTestUser,
  TestUser,
} from "../helpers/db.helper";
import { generateAccessToken } from "../helpers/auth.helper";

describe("Donation Request Routes", () => {
  let donor: TestUser;
  let requester: TestUser;
  let admin: TestUser;
  let donorToken: string;
  let requesterToken: string;
  let adminToken: string;
  let donationRequestId: string;
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    donor = await createTestUser();
    requester = await createTestUser();
    admin = await createTestAdmin();
    createdUserIds.push(donor.id, requester.id, admin.id);

    donorToken = generateAccessToken({
      id: donor.id,
      name: donor.name,
      email: donor.email,
      role: "USER",
    });

    requesterToken = generateAccessToken({
      id: requester.id,
      name: requester.name,
      email: requester.email,
      role: "USER",
    });

    adminToken = generateAccessToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "ADMIN",
    });

    const existingRequest = await createTestDonationRequest({
      donorId: donor.id,
      requesterId: requester.id,
    });
    donationRequestId = existingRequest.id;
  });

  afterAll(async () => {
    await cleanupTestData(createdUserIds);
  });

  describe("POST /api/v1/donation-request", () => {
    it("creates a donation request with valid payload and auth", async () => {
      const newDonor = await createTestUser();
      const newRequester = await createTestUser();
      createdUserIds.push(newDonor.id, newRequester.id);

      const newRequesterToken = generateAccessToken({
        id: newRequester.id,
        name: newRequester.name,
        email: newRequester.email,
        role: "USER",
      });

      const res = await request(app)
        .post("/api/v1/donation-request")
        .set("Authorization", newRequesterToken)
        .send({
          donorId: newDonor.id,
          requesterId: newRequester.id,
          phoneNumber: "01800000000",
          dateOfDonation: "2026-06-01",
          timeOfDonation: "09:00",
          hospitalName: "Square Hospital",
          hospitalAddress: "Panthapath, Dhaka",
          reason: "Scheduled surgery",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.donorId).toBe(newDonor.id);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app).post("/api/v1/donation-request").send({
        donorId: donor.id,
        requesterId: requester.id,
        phoneNumber: "01800000000",
        dateOfDonation: "2026-06-01",
        timeOfDonation: "09:00",
        hospitalName: "Square Hospital",
        hospitalAddress: "Panthapath, Dhaka",
        reason: "Scheduled surgery",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 when required field donorId is missing", async () => {
      const res = await request(app)
        .post("/api/v1/donation-request")
        .set("Authorization", requesterToken)
        .send({
          requesterId: requester.id,
          phoneNumber: "01800000000",
          dateOfDonation: "2026-06-01",
          timeOfDonation: "09:00",
          hospitalName: "Square Hospital",
          hospitalAddress: "Panthapath, Dhaka",
          reason: "Scheduled surgery",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 when phoneNumber is shorter than 10 characters", async () => {
      const res = await request(app)
        .post("/api/v1/donation-request")
        .set("Authorization", requesterToken)
        .send({
          donorId: donor.id,
          requesterId: requester.id,
          phoneNumber: "0170",
          dateOfDonation: "2026-06-01",
          timeOfDonation: "09:00",
          hospitalName: "Square Hospital",
          hospitalAddress: "Panthapath, Dhaka",
          reason: "Scheduled surgery",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/donation-request/my-donation-requests", () => {
    it("returns paginated list for authenticated USER", async () => {
      const res = await request(app)
        .get("/api/v1/donation-request/my-donation-requests")
        .set("Authorization", requesterToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app).get(
        "/api/v1/donation-request/my-donation-requests"
      );

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/donation-request/my-donor-requests", () => {
    it("returns paginated donor requests for authenticated USER", async () => {
      const res = await request(app)
        .get("/api/v1/donation-request/my-donor-requests")
        .set("Authorization", donorToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("PUT /api/v1/donation-request/:requestId", () => {
    it("updates request status to APPROVED", async () => {
      const res = await request(app)
        .put(`/api/v1/donation-request/${donationRequestId}`)
        .set("Authorization", donorToken)
        .send({ status: "APPROVED" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("updates request status to REJECTED", async () => {
      const anotherDonor = await createTestUser();
      const anotherRequester = await createTestUser();
      createdUserIds.push(anotherDonor.id, anotherRequester.id);

      const anotherRequest = await createTestDonationRequest({
        donorId: anotherDonor.id,
        requesterId: anotherRequester.id,
      });

      const anotherDonorToken = generateAccessToken({
        id: anotherDonor.id,
        name: anotherDonor.name,
        email: anotherDonor.email,
        role: "USER",
      });

      const res = await request(app)
        .put(`/api/v1/donation-request/${anotherRequest.id}`)
        .set("Authorization", anotherDonorToken)
        .send({ status: "REJECTED" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 when status is an invalid enum value", async () => {
      const res = await request(app)
        .put(`/api/v1/donation-request/${donationRequestId}`)
        .set("Authorization", donorToken)
        .send({ status: "INVALID_STATUS" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app)
        .put(`/api/v1/donation-request/${donationRequestId}`)
        .send({ status: "APPROVED" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/donation-request (Admin)", () => {
    it("returns all donation requests for ADMIN role", async () => {
      const res = await request(app)
        .get("/api/v1/donation-request")
        .set("Authorization", adminToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("returns 403 when USER role tries to access admin endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/donation-request")
        .set("Authorization", requesterToken);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app).get("/api/v1/donation-request");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
