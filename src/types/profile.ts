export type CreateProfileRequest = {
    profile_name: string;
    bio?: string;
    profile_image_url?: string;
}

export type CreateProfileResponse = {
    message: string;
    profile: Profile;
};

export type ProfileAdjustmentResponse = {
    message: string;
    profile: Profile;
};

export type ProfileLink = {
    link_id: string;
    profile_id: string;
    label: string;
    url: string;
    display_order: number;
    created_at: string;
    updated_at: string;
};

export type ContactType = "phone" | "email";

export type ProfileContact = {
    contact_id: string;
    profile_id: string;
    contact_type: ContactType;
    label: string | null;
    value: string;
    is_primary: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
};

export type ProfileContactCreate = {
    contact_type: ContactType;
    region?: string;
    label?: string;
    value: string;
    is_primary?: boolean;
};

export type ProfileContactUpdate = {
    label?: string;
    value?: string;
    region?: string;
    is_primary?: boolean;
};

export type PublicProfileContact = {
    contact_type: ContactType;
    label: string | null;
    value: string;
    is_primary: boolean;
};

export type PublicProfile = {
    profile_id: string;
    profile_name: string;
    bio?: string;
    profile_image_url?: string;
    links?: ProfileLink[];
    contact_info?: PublicProfileContact[];
};

export type ProfileStatus = "active" | "inactive" | "archived" | "disabled";

export type Profile = {
    profile_id: string;
    user_id: string;
    profile_name: string;
    bio: string | null;
    profile_status: ProfileStatus;
    profile_image_url: string | null;
    created_at: string;
    updated_at: string;
};

export type ProfileLinkCreate = {
    label: string;
    url: string;
};

export type DashboardProfile = {
    profile_id: string;
    profile_name: string;
    profile_status: ProfileStatus;
    profile_image_url: string | null;
    link_count?: number;
    card_count?: number;
}

export type ProfileUpdate = {
    profile_name?: string;
    bio?: string | null;
    profile_status?: ProfileStatus;
    profile_image_url?: string | null;
}