import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ProfilePictureUpload from "../../components/auth/ProfilePictureUpload";
import UserAvatar from "../../components/common/UserAvatar";
import { useAuthProfile } from "../../hooks/auth/useAuthProfile";
import { useUpdateProfilePicture } from "../../hooks/auth/useUpdateProfilePicture";
import { selectUser } from "../../store/auth/authSlice";

const ProfilePage = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const profileQuery = useAuthProfile();
    const updatePictureMutation = useUpdateProfilePicture();
    const [picture, setPicture] = useState(null);
    const [formError, setFormError] = useState("");

    const handlePictureSubmit = (event) => {
        event.preventDefault();
        setFormError("");

        if (!picture) {
            setFormError(t("pages.profile.pictureRequired"));
            return;
        }

        updatePictureMutation.mutate(picture, {
            onSuccess: () => {
                setPicture(null);
            },
            onError: (error) => {
                setFormError(error.message || t("pages.profile.pictureUpdateError"));
            },
        });
    };

    return (
        <main className="mx-auto max-w-lg px-6 py-12">
            <h1 className="mb-2 text-2xl font-semibold text-neutral-100">
                {t("pages.profile.title")}
            </h1>
            <p className="mb-8 text-neutral-400">
                {t("pages.profile.description")}
            </p>

            <section className="rounded-lg border border-kashf-border bg-kashf-surface p-6">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-start">
                    <UserAvatar user={user} className="size-24" />
                    <div className="min-w-0">
                        <p className="truncate text-lg font-medium text-neutral-100">
                            {user?.username || t("profileMenu.fallbackName")}
                        </p>
                        {user?.email && (
                            <p className="truncate text-sm text-neutral-500">
                                {user.email}
                            </p>
                        )}
                        {!user?.picture && (
                            <p className="mt-2 text-sm text-neutral-500">
                                {t("pages.profile.noPicture")}
                            </p>
                        )}
                    </div>
                </div>

                {profileQuery.isFetching && (
                    <p className="mt-6 text-sm text-neutral-500">
                        {t("pages.profile.loading")}
                    </p>
                )}

                {profileQuery.isError && (
                    <p className="mt-6 text-sm text-red-400" role="alert">
                        {t("pages.profile.loadError")}
                    </p>
                )}

                <form onSubmit={handlePictureSubmit} className="mt-8 space-y-4 border-t border-kashf-border pt-6">
                    <h2 className="text-sm font-medium text-neutral-300">
                        {t("pages.profile.updatePictureTitle")}
                    </h2>
                    <ProfilePictureUpload
                        value={picture}
                        onChange={setPicture}
                        error={formError}
                    />
                    <button
                        type="submit"
                        disabled={updatePictureMutation.isPending}
                        className="rounded-md bg-kashf-blue px-4 py-2 text-sm font-semibold text-kashf-bg transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                        {updatePictureMutation.isPending
                            ? t("pages.profile.pictureUpdating")
                            : t("pages.profile.pictureUpdate")}
                    </button>
                </form>
            </section>
        </main>
    );
};

export default ProfilePage;
