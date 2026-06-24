import { apiRequest } from "./client";
import type { Profile, PublicProfile, ProfileLink, ProfileLinkCreate, CreateProfileRequest, CreateProfileResponse } from "../types/profile";

export async function getPublicProfile(profileId: string) {
    return apiRequest<PublicProfile>(`/profiles/public/${profileId}`);    
}

export async function getMyProfiles() {
    return apiRequest<Profile[]>(`/profiles/me`);
}

export async function createProfile(profileData: CreateProfileRequest) {
    return apiRequest<CreateProfileResponse>("/profiles/create_profile", {
        method: "POST",
        body: JSON.stringify(profileData),
    });
}

export async function getProfileLinks(profileId: string) {
    return apiRequest<ProfileLink[]>(`/profile_links/${profileId}/links`);
}

export async function getProfile(profileId: string) {
    return apiRequest<Profile>(`/profiles/${profileId}`);
}

export async function createProfileLink(profileId: string, linkData: ProfileLinkCreate) {
    return apiRequest(`/profile_links/${profileId}/links`, {
        method: "POST",
        body: JSON.stringify(linkData),
    });
}

export async function deleteProfileLink(linkId: string) {
    return apiRequest(`/profile_links/links/${linkId}`, {
        method: "DELETE"
    });
}

export async function updateProfile(profileId: string, profileData: Partial<Profile>) {
    return apiRequest<CreateProfileResponse>(`/profiles/${profileId}/update_profile`, {
        method: "PATCH",
        body: JSON.stringify(profileData),
    });
}