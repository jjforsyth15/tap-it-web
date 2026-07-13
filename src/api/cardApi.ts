import { apiRequest } from "./client";
import type {  
    PublicCardResponse, 
    CardActivationStatus, 
    CardResponse, 
    CardCreateRequest, 
    CardCreateResponse,
    CardUpdateRequest,
    CardActivationRequest,
    CardAdjustmentResponse
} from "../types/card";

export async function activateCard(activationRequest: CardActivationRequest) {
    return apiRequest<CardAdjustmentResponse>(`/cards/${activationRequest.card_code}/activate`, {
        method: "PATCH",
        body: JSON.stringify(activationRequest)
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

export async function getActiveProfileCards(profileId: string) {
    return apiRequest<CardResponse[]>(`/cards/profile/${profileId}/active`);
}

export async function getUserCards() {
    return apiRequest<CardResponse[]>(`/cards`);
}

export async function getCard(cardCode: string) {
    return apiRequest<CardResponse>(`/cards/${cardCode}`);
}

export async function CreateCard(cardData: CardCreateRequest) {
    return apiRequest<CardCreateResponse>(`/cards`, {
        method: "POST",
        body: JSON.stringify(cardData)
    });
}

export async function updateCard(cardId: string, cardData: CardUpdateRequest) {
    return apiRequest<CardCreateResponse>(`/cards/${cardId}`, {
        method: "PATCH",
        body: JSON.stringify(cardData)
    });
}

export async function deactivateCard(cardId: string) {
    return apiRequest<string>(`/cards/${cardId}/deactivate`, {
        method: "PATCH",
    });
}