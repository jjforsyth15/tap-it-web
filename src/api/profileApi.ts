import { apiRequest } from "./client";
import type { Profile, PublicProfile, ProfileLink, ProfileLinkCreate } from "../types/profile";

export async function getPublicProfile(profileId: string) {
    return apiRequest<PublicProfile>(`/profiles/public/${profileId}`);    
}

export async function getMyProfiles() {
    return apiRequest<Profile[]>(`/profiles/me`);
}

export async function getProfileLinks(profileId: string) {
    return apiRequest<ProfileLink[]>(`/profile_links/${profileId}/links`);
}

export async function getProfile(profileId: string) {
    return apiRequest<Profile>(`/profiles/${profileId}`);
}

export async function CreateProfileLink(profileId: string, linkData: ProfileLinkCreate) {
    return apiRequest(`/profile_links/${profileId}/links`, {
        method: "POST",
        body: JSON.stringify(linkData),
    });
}