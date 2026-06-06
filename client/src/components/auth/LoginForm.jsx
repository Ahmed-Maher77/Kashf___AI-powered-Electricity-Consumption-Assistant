import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLogin } from "../../hooks/auth/useLogin";
import { loginSchema } from "../../schemas/authSchemas";
import PasswordInput from "./PasswordInput";
import {
    authErrorClassName,
    authInputClassName,
    authLabelClassName,
} from "./authStyles";

const LoginForm = () => {
    const { t } = useTranslation();
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (values) => {
        loginMutation.mutate(values, {
            onError: (error) => {
                if (error.details?.length) {
                    error.details.forEach((detail) => {
                        if (detail.field === "email" || detail.field === "password") {
                            setError(detail.field, { message: detail.message });
                        }
                    });
                    return;
                }

                setError("root", {
                    message: error.message || t("auth.loginGenericError"),
                });
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="email" className={authLabelClassName}>
                    {t("register.email")}
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    className={authInputClassName}
                    {...register("email")}
                />
                {errors.email && (
                    <p className={authErrorClassName}>{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className={authLabelClassName}>
                    {t("register.password")}
                </label>
                <PasswordInput
                    id="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    disabled={loginMutation.isPending}
                    {...register("password")}
                />
                {errors.password && (
                    <p className={authErrorClassName}>{errors.password.message}</p>
                )}
            </div>

            {errors.root && (
                <p className="text-sm text-red-400" role="alert">
                    {errors.root.message}
                </p>
            )}

            <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full rounded-md bg-kashf-blue py-2.5 text-sm font-semibold text-kashf-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
                {loginMutation.isPending
                    ? t("auth.loginSubmitting")
                    : t("auth.loginSubmit")}
            </button>
        </form>
    );
};

export default LoginForm;
