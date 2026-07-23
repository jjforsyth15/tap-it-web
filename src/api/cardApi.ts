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

export async function activateCard(activationRequest: CardActivationRequest): Promise<CardAdjustmentResponse> {
    return apiRequest<CardAdjustmentResponse>(`/cards/${activationRequest.card_code}/activate`, {
        method: "PATCH",
        body: JSON.stringify(activationRequest)
    });
}

export async function getPublicCard(cardCode: string): Promise<PublicCardResponse> {
    return apiRequest<PublicCardResponse>(`/cards/${cardCode}/public`);
}

export async function getCardActivationStatus(cardCode: string): Promise<CardActivationStatus> {
    return apiRequest<CardActivationStatus>(`/cards/${cardCode}/activation_info`);
}

export async function getProfileCards(profileId: string): Promise<CardResponse[]> {
    return apiRequest<CardResponse[]>(`/cards/profile/${profileId}`);
}

export async function getActiveProfileCards(profileId: string): Promise<CardResponse[]> {
    return apiRequest<CardResponse[]>(`/cards/profile/${profileId}/active`);
}

export async function getUserCards(): Promise<CardResponse[]> {
    return apiRequest<CardResponse[]>(`/cards`);
}

export async function getCard(cardCode: string): Promise<CardResponse> {
    return apiRequest<CardResponse>(`/cards/${cardCode}`);
}

export async function CreateCard(cardData: CardCreateRequest): Promise<CardCreateResponse> {
    return apiRequest<CardCreateResponse>(`/cards`, {
        method: "POST",
        body: JSON.stringify(cardData)
    });
}

export async function updateCard(cardId: string, cardData: CardUpdateRequest): Promise<CardAdjustmentResponse> {
    return apiRequest<CardAdjustmentResponse>(`/cards/${cardId}`, {
        method: "PATCH",
        body: JSON.stringify(cardData)
    });
}

export async function deactivateCard(cardId: string): Promise<string> {
    return apiRequest<string>(`/cards/${cardId}/deactivate`, {
        method: "PATCH",
    });
}