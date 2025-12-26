import { UserRoleValue } from 'src/shared/domain/enums/user-role.enum.ts';

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: string;
    }
  }
}

// Add this interface for your use cases
export interface CurrentUserPayload {
  userId: string;
  email: string;
  role: string;
}