import { useState, useEffect, useCallback } from "react";

export default function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const checkInstalled = () => {
            const standalone =
                window.matchMedia("(display-mode: standalone)").matches ||
                navigator.standalone ||
                document.referrer.includes("android-app://");
            setIsInstalled(standalone);
        };

        checkInstalled();

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        const onChange = () => checkInstalled();
        mediaQuery.addEventListener("change", onChange);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            mediaQuery.removeEventListener("change", onChange);
        };
    }, []);

    const install = useCallback(async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);

        if (outcome === "accepted") {
            setIsInstalled(true);
        }
    }, [deferredPrompt]);

    return { isInstallable: !!deferredPrompt && !isInstalled, isInstalled, install };
}
