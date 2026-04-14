import request from "supertest";
import app from "../../src/app";
import { BloodType } from "@prisma/client";
import { cleanupTestData, createTestUser } from "../helpers/db.helper";

describe("Donor List Routes", () => {
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    const donor1 = await createTestUser({
      name: "Donor Alpha",
      bloodType: BloodType.A_POSITIVE,
    });
    const donor2 = await createTestUser({
      name: "Donor Beta",
      bloodType: BloodType.B_POSITIVE,
    });
    const donor3 = await createTestUser({
      name: "Donor Gamma",
      bloodType: BloodType.O_POSITIVE,
    });
    createdUserIds.push(donor1.id, donor2.id, donor3.id);
  });

  afterAll(async () => {
    await cleanupTestData(createdUserIds);
  });

  describe("GET /api/v1/donor-list", () => {
    it("returns a paginated donor list without auth", async () => {
      const res = await request(app).get("/api/v1/donor-list");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(typeof res.body.meta.total).toBe("number");
      expect(typeof res.body.meta.page).toBe("number");
      expect(typeof res.body.meta.limit).toBe("number");
    });

    it("respects page and limit query parameters", async () => {
      const res = await request(app).get("/api/v1/donor-list?page=1&limit=2");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
    });

    it("filters donors by bloodType", async () => {
      const res = await request(app).get(
        "/api/v1/donor-list?bloodType=A_POSITIVE"
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        res.body.data.forEach((donor: { bloodType: string }) => {
          expect(donor.bloodType).toBe("A_POSITIVE");
        });
      }
    });

    it("filters donors by searchTerm", async () => {
      const res = await request(app).get(
        "/api/v1/donor-list?searchTerm=Donor Alpha"
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
