import { useState } from "react";
import { getUserInitials } from "../../auth/userProfile";

const UserAvatar = ({ user, className = "size-9" }) => {
    const initials = getUserInitials(user?.username);
    const [failedPictureUrl, setFailedPictureUrl] = useState(null);
    const picture = user?.picture ?? null;
    const showPicture = picture && failedPictureUrl !== picture;

    if (showPicture) {
        return (
            <img
                key={picture}
                src={picture}
                alt={user.username || ""}
                className={`${className} rounded-full object-cover`}
                onError={() => setFailedPictureUrl(picture)}
            />
        );
    }

    return (
        <span
            className={`${className} flex items-center justify-center rounded-full bg-kashf-muted text-xs font-semibold text-kashf-light-blue`}
            aria-hidden="true"
        >
            {initials}
        </span>
    );
};

export default UserAvatar;
