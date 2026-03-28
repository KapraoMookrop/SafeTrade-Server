import type { KycStatus, UserRole, UserStatus } from "./Enum.js";

export interface UserJWT {
    userId: string;
    fullName: string;
    email: string;
    role: UserRole;
    phone: string;
    kycStatus: KycStatus;
    userStatus: UserStatus;
    isEnabled2FA: boolean;
}
