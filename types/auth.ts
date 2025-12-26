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

export enum RequestType {
    FORGOT_PASSWORD = "FORGOT_PASSWORD",
    CHANGE_PASSWORD = "CHANGE_PASSWORD",
}

export interface ResetPasswordRequest {
    email: string;
    token: string | null;
    oldPassword: string | null;
    newPassword: string;
    confirmNewPassword: string;
    type: RequestType;
}

export interface VerifyRequest {
    email: string;
    token: string;
}

export interface PresignProfilePictureRequest {
    fileName: string;
    contentType: string;
}

export interface PresignProfilePictureResponse {
    uploadUrl: string;
    key: string;
}

export interface SaveProfilePictureRequest {
    key: string;
}

export interface ViewProfilePictureResponse {
    url: string;
}
