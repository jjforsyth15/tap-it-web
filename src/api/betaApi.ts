import { apiRequest } from "./client";
import type { BetaFeedbackRequest } from "../types/beta";


export async function submitBetafeedback(feedback: BetaFeedbackRequest) {
    return apiRequest("/beta/feedback", {
        method: "POST",
        body: JSON.stringify(feedback),
    });
}