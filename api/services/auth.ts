import { apiClient } from "../config";

import {
    ForgotPasswordRequest,
    PresignProfilePictureRequest,
    PresignProfilePictureResponse,
    ResetPasswordRequest,
    SaveProfilePictureRequest,
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    User,
    VerifyRequest,
    ViewProfilePictureResponse
} from "@/types/auth";

export const authService = {
    signIn: async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await apiClient.post<SignInResponse>("/auth/login", data);
        const user = response.data.user;
        if (user.profilePicUrl && !user.profilePicUrl.startsWith("http")) {
            try {
                // If we have a key but not a URL, fetch the signed URL.
                // Note: For sign-in, we might not be able to call authenticated endpoints immediately 
                // unless we attach the token. But usually the token is saved after this returns.
                // Ideally, the backend should return the signed URL in login response.
                // If we can't fetch it here without setting token first, we might skip.
                // But let's assume we can or rely on getCurrentUser being called later.
                // actually, let's just leave signIn alone as getCurrentUser usually runs on app load?
                // OR, for immediate login experience, we might need it. 
                // Let's defer to checkAuth/getCurrentUser for now to avoid token race conditions.
            } catch (e) {
                // ignore
            }
        }
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
        const response = await apiClient.get<User>("/user/me");
        const user = response.data;
        if (user.profilePicUrl && !user.profilePicUrl.startsWith("http")) {
            try {
                const picRes = await authService.getProfilePicture();
                if (picRes.url) {
                    user.profilePicUrl = picRes.url;
                }
            } catch (e) {
                // ignore
            }
        }
        return user;
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
        const user = response.data;
        if (user.profilePicUrl && !user.profilePicUrl.startsWith("http")) {
            try {
                const picRes = await authService.getUserProfilePicture(userId);
                if (picRes.url) {
                    user.profilePicUrl = picRes.url;
                }
            } catch (e) {
                // ignore
            }
        }
        return user;
    },

    blockUser: async (userId: number): Promise<void> => {
        await apiClient.post(`/user/${userId}/block`);
    },

    unblockUser: async (userId: number): Promise<void> => {
        await apiClient.delete(`/user/${userId}/unblock`);
    },

    getBlockedUsers: async (): Promise<User[]> => {
        const response = await apiClient.get<{ numberOfBlocked: number; userList: User[] }>("/user/blocked");
        return response.data.userList;
    },

    getUniversities: async (): Promise<{ name: string }[]> => {
        const response = await apiClient.get<{ name: string }[]>("/universities");
        return response.data;
    },

    presignProfilePicture: async (data: PresignProfilePictureRequest): Promise<PresignProfilePictureResponse> => {
        const response = await apiClient.post<PresignProfilePictureResponse>("/user/profile-picture/presign", data);
        return response.data;
    },

    saveProfilePicture: async (data: SaveProfilePictureRequest): Promise<void> => {
        await apiClient.put("/user/profile-picture", data);
    },

    getProfilePicture: async (): Promise<ViewProfilePictureResponse> => {
        const response = await apiClient.get<ViewProfilePictureResponse>("/user/profile-picture/me");
        return response.data;
    },

    getUserProfilePicture: async (userId: number): Promise<ViewProfilePictureResponse> => {
        const response = await apiClient.get<ViewProfilePictureResponse>(`/user/${userId}/profile-picture`);
        return response.data;
    },
};