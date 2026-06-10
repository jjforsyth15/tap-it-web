import { apiRequest } from "./client";
import type { Profile, PublicProfile, ProfileLink } from "../types/profile";

export async function getPublicProfile(profileId: string) {
    return apiRequest<PublicProfile>(`/profiles/public/${profileId}`);    
}

export async function getMyProfiles() {
    return apiRequest<Profile[]>(`/profiles/me`);
}

export async function getProfileLinks(profileId: string) {
    return apiRequest<ProfileLink[]>(`/profile_links/${profileId}/links`);
}