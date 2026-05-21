import { apiRequest } from "./client";
import type { ActivateCardResponse } from "../types/card";

export async function activateCard(cardCode: string) {
    return apiRequest<ActivateCardResponse>(`/cards/${cardCode}/activate`, {
        method: "PATCH",
    });
}