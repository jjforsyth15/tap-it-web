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
    can_activate: boolean;
}

export type CardResponse = {
    profile_id: string;
    card_id: string;
    card_name: string;
    card_code: string;
    pointing_url: string;
    card_status: string;
    created_at: string;
}