import { apiRequest } from "./client";
import type { ActivateCardResponse, PublicCardResponse, CardActivationStatus, CardResponse } from "../types/card";

export async function activateCard(cardCode: string) {
    return apiRequest<ActivateCardResponse>(`/cards/${cardCode}/activate`, {
        method: "PATCH",
    });
}

export async function getPublicCard(cardCode: string) {
    return apiRequest<PublicCardResponse>(`/cards/${cardCode}/public`);
}

export async function getCardActivationStatus(cardCode: string) {
    return apiRequest<CardActivationStatus>(`/cards/${cardCode}/activation_info`);
}

export async function getProfileCards(profileId: string) {
    return apiRequest<CardResponse[]>(`/cards/profile/${profileId}`);
}