export type ProfileLink = {
    label: string;
    url: string;
};

export type PublicProfile = {
    profile_id: string;
    profile_name: string;
    bio?: string;
    website_url?: string;
    links?: ProfileLink[];
};