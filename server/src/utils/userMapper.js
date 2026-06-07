export const toPublicUser = (user) => ({
    id: user._id?.toString?.() ?? user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan ?? "free",
    picture: user.picture ?? null,
});
