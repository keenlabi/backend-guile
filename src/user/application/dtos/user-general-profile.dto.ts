export class UserGeneralProfileDto {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  role: string;
  createdAt: Date;

  // Profile fields
  firstName: string | null;
  lastName: string | null;
}