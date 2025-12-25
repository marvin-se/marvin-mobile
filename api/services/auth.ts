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
        await apiClient.delete("/user/me");
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
        return response.data;
    },
};