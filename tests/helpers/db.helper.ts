import { BloodType, Gender, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

export const testPrisma = new PrismaClient();

const SALT_ROUNDS = Number(process.env["SALT_ROUNDS"]) || 1;

type CreateTestUserOptions = {
  email?: string;
  password?: string;
  name?: string;
  role?: keyof typeof UserRole;
  bloodType?: BloodType;
  gender?: Gender;
  location?: string;
};

export type TestUser = {
  id: string;
  name: string;
  email: string;
  role: keyof typeof UserRole;
  password: string;
};

export async function createTestUser(
  options: CreateTestUserOptions = {},
): Promise<TestUser> {
  const plainPassword = options.password ?? "Test@1234";
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  const user = await testPrisma.user.create({
    data: {
      name: options.name ?? "Test User",
      email:
        options.email ??
        `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
      password: hashedPassword,
      bloodType: options.bloodType ?? BloodType.A_POSITIVE,
      gender: options.gender ?? Gender.MALE,
      location: options.location ?? "Dhaka",
      role: (options.role ?? "USER") as UserRole,
      userProfile: {
        create: {
          bio: "",
          age: 0,
          lastDonationDate: "",
        },
      },
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    password: plainPassword,
  };
}

export async function createTestAdmin(
  options: CreateTestUserOptions = {},
): Promise<TestUser> {
  return createTestUser({ ...options, role: "ADMIN" });
}

export async function createTestSuperAdmin(
  options: CreateTestUserOptions = {},
): Promise<TestUser> {
  return createTestUser({ ...options, role: "SUPER_ADMIN" });
}

type CreateDonationRequestOptions = {
  donorId: string;
  requesterId: string;
};

export async function createTestDonationRequest(
  options: CreateDonationRequestOptions,
) {
  return testPrisma.request.create({
    data: {
      donorId: options.donorId,
      requesterId: options.requesterId,
      phoneNumber: "01700000000",
      dateOfDonation: "2026-05-01",
      timeOfDonation: "10:00",
      hospitalName: "Dhaka Medical",
      hospitalAddress: "Dhaka, Bangladesh",
      reason: "Emergency surgery",
    },
  });
}

export async function cleanupTestData(userIds: string[]): Promise<void> {
  if (userIds.length === 0) return;

  await testPrisma.eventRegistrations.deleteMany({
    where: { userId: { in: userIds } },
  });

  await testPrisma.review.deleteMany({
    where: { userId: { in: userIds } },
  });

  await testPrisma.request.deleteMany({
    where: {
      OR: [{ donorId: { in: userIds } }, { requesterId: { in: userIds } }],
    },
  });

  await testPrisma.userProfile.deleteMany({
    where: { userId: { in: userIds } },
  });

  await testPrisma.user.deleteMany({
    where: { id: { in: userIds } },
  });
}
