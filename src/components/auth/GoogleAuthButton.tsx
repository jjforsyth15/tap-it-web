import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { googleLogin } from "../../api/authApi";
import { useAuth } from "../../context/authContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// eslint-disable-next-line react-refresh/only-export-components
export const isGoogleAuthEnabled = Boolean(googleClientId);

type GoogleAuthButtonProps = {
    variant: "login" | "signup";
    next: string;
    onError: (message: string) => void;
    onLinkRequired: (credential: string) => void;
}

export default function GoogleAuthButton({ variant, next, onError, onLinkRequired }: GoogleAuthButtonProps) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!googleClientId) return null;

    return (
        <GoogleLogin
            text={variant === "signup" ? "signup_with" : "signin_with"}
            theme="filled_blue"
            size="large"
            shape="pill"
            width={250}
            containerProps={{ className: "auth-google-button" }}
            onSuccess={async ({ credential }) => {
                if (isSubmitting) return;

                onError("");

                if (!credential) {
                    onError("Google did not return a credential.");
                    return;
                }

                setIsSubmitting(true);

                try {
                    const response = await googleLogin({ credential });
                    login(response.access_token);
                    navigate(next, { replace: true });
                } catch (error) {
                    if (error instanceof ApiError && error.status === 400) {
                        onLinkRequired(credential);
                        return;
                    }

                    onError(error instanceof Error ? error.message : "Google sign-in failed.");
                } finally {
                    setIsSubmitting(false);
                }
            }}
            onError={() => onError("The Google sign-in window could not be completed.")}
        />
    );
}
