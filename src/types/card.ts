export type ActivateCardResponse = {
    message: string;
    card_name: string;
    card_status: string;
    profile_id: string;
};

export type PublicCardResponse = {
    card_code: string;
    card_name: string;
    card_status: string;
    profile_id?: string;
};

export type CardActivationStatus = {
    card_code: string;
    card_name: string;
    card_status: string;
    profile_id?: string;
    can_activate: boolean;
}

export type CardResponse = {
    card_id: string;
    profile_id: string;
    card_name: string;
    card_code: string;
    pointing_url: string;
    card_status: string;
    created_at: string;
    activated_at?: string;
    updated_at: string;
}

export type CardUpdateRequest = {
    card_name?: string;
    profile_id?: string;
    card_status?: string;
}

export type CardCreateRequest = {
    profile_id?: string;
    card_name: string;
}

export type CardCreateResponse = {
    message: string;
    card: CardResponse;
}

export type CardActivationRequest = {
    card_code: string;
    new_profile_id?: string;
}

export type CardAdjustmentResponse = {
    message: string;
    card: CardResponse;
}