export type CreateProfileRequest = {
    profile_name: string;
    bio?: string;
    profile_image_url?: string;
}

export type CreateProfileResponse = {
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

export type PublicProfile = {
    profile_id: string;
    profile_name: string;
    bio?: string;
    website_url?: string;
    links?: ProfileLink[];
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

