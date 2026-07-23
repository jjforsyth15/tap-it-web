import { apiRequest } from "./client";
import type { BetaFeedbackRequest, BetaFeedbackResponse } from "../types/beta";


export async function submitBetafeedback(feedback: BetaFeedbackRequest): Promise<BetaFeedbackResponse> {
    return apiRequest<BetaFeedbackResponse>("/beta/feedback", {
        method: "POST",
        body: JSON.stringify(feedback),
    });
}