export function getApiErrorMessage(error: unknown): string {
    if (typeof error !== "object" || error === null) 
        return "Something went wrong. Please try again.";

    const apiError = error as {
        detail?: string | Array<{ msg?: string }>;
        message?: string;
    };

    if (typeof apiError.detail === "string") 
        return apiError.detail;

    if (Array.isArray(apiError.detail))
        return apiError.detail.map((item) => item.msg).filter(Boolean).join(", ");

    if (typeof apiError.message === "string")
        return apiError.message;

    return "Something went wrong. Please try again.";
}