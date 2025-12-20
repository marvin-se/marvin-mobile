export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    universityId: number;
    universityName: string;
    profilePicUrl: string;
    createdAt: string;
    isActive: boolean;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    token: string;
    user: User;
}

export interface SignUpRequest {
    fullName: string;
    email: string;
    password: string;
    university: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface VerifyRequest {
    email: string;
    token: string;
}
