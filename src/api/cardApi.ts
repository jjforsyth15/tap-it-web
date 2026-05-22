import { apiRequest } from "./client";
import type { ActivateCardResponse, PublicCardResponse } from "../types/card";

export async function activateCard(cardCode: string) {
    return apiRequest<ActivateCardResponse>(`/cards/${cardCode}/activate`, {
        method: "PATCH",
    });
}

export async function getPublicCard(cardCode: string) {
    return apiRequest<PublicCardResponse>(`/cards/${cardCode}/public`);
}