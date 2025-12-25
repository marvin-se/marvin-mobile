
export const getAvatarUrl = (name?: string | null, profilePicUrl?: string | null): string => {
    if (profilePicUrl && profilePicUrl.trim() !== '') {
        return profilePicUrl;
    }

    const displayName = name?.trim() || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=72C69B&color=fff&bold=true&size=200`;
};
