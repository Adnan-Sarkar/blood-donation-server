import { UserRole } from '@prisma/client';

type TJWTPayload = {
  id: string;
  name: string;
  email: string;
  role: keyof typeof UserRole;
};

export default TJWTPayload;
