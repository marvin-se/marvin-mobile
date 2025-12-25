import { apiClient } from "../config";

import {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    User,
    VerifyRequest
} from "@/types/auth";

export const authService = {
    // Profile Picture APIs
    getProfilePicturePresign: async (): Promise<{ uploadUrl: string; key: string }> => {
        const response = await apiClient.post<{ uploadUrl: string; key: string }>("/user/profile-picture/presign");
        return response.data;
    },

    uploadProfilePicture: async (uploadUrl: string, imageUri: string, contentType: string): Promise<void> => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: {
                'Content-Type': contentType,
            },
        });
        if (!uploadResponse.ok) {
            throw new Error('Failed to upload profile picture');
        }
    },

    setProfilePicture: async (key: string): Promise<void> => {
        await apiClient.put("/user/profile-picture", { key });
    },

    getMyProfilePicture: async (): Promise<{ url: string }> => {
        const response = await apiClient.get<{ url: string }>("/user/profile-picture/me");
        return response.data;
    },

    getUserProfilePicture: async (userId: number): Promise<{ url: string }> => {
        const response = await apiClient.get<{ url: string }>(`/user/${userId}/profile-picture`);
        return response.data;
    },
    signIn: async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await apiClient.post<SignInResponse>("/auth/login", data);
        return response.data;
    },

    signUp: async (data: SignUpRequest): Promise<User> => {
        const response = await apiClient.post<User>("/auth/register", data);
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        await apiClient.post("/auth/forgot-password", data);
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await apiClient.post("/auth/change-password", data);
    },

    verifyEmail: async (data: VerifyRequest): Promise<void> => {
        await apiClient.post("/auth/verify", data);
    },

    verifyResetCode: async (data: VerifyRequest): Promise<void> => {
        await apiClient.post("/auth/verify-reset-code", data);
    },

    resend: async (data: ForgotPasswordRequest): Promise<void> => {
        await apiClient.post("/auth/resend", data);
    },

    logout: async (): Promise<void> => {
        await apiClient.post("/auth/logout");
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>("/auth/me");
        return response.data;
    },

    updateProfile: async (data: { fullName?: string; phoneNumber?: string }): Promise<User> => {
        const response = await apiClient.put<User>("/user/edit-profile", data);
        return response.data;
    },

    changePassword: async (data: ResetPasswordRequest): Promise<void> => {
        await apiClient.post("/auth/change-password", data);
    },

    deleteAccount: async (): Promise<void> => {
        await apiClient.delete("/user/delete-profile");
    },

    getUserById: async (userId: number): Promise<User> => {
        const response = await apiClient.get<User>(`/user/${userId}`);
        return response.data;
    },

    blockUser: async (userId: number): Promise<void> => {
        await apiClient.post(`/user/${userId}/block`);
    },

    unblockUser: async (userId: number): Promise<void> => {
        await apiClient.post(`/user/${userId}/unblock`);
    },

    getBlockedUsers: async (): Promise<User[]> => {
        const response = await apiClient.get<User[]>("/user/blocked");
    getUniversities: async (): Promise<{ name: string }[]> => {
        const response = await apiClient.get<{ name: string }[]>("/universities");
        return response.data;
    },
};