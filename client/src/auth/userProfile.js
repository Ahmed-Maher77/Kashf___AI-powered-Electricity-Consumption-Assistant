export const normalizeUserProfile = (user) => {
    if (!user || typeof user !== "object") {
        return null;
    }

    const resolvedId = user.id ?? user._id ?? null;

    return {
        id: resolvedId != null ? String(resolvedId) : null,
        username: user.username ?? "",
        email: user.email ?? "",
        subscriptionPlan: user.subscriptionPlan ?? "free",
        picture: user.picture ?? null,
    };
};

export const getUserInitials = (username) => {
    const trimmed = username?.trim();

    if (!trimmed) {
        return "?";
    }

    const parts = trimmed.split(/\s+/);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return trimmed.slice(0, 2).toUpperCase();
};
