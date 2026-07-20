import { apiRequest } from "./client";
import type { 
    Profile, 
    PublicProfile, 
    ProfileLink, 
    ProfileLinkCreate, 
    CreateProfileRequest, 
    CreateProfileResponse, 
    ProfileUpdate, 
    ProfileAdjustmentResponse } from "../types/profile";

type MessageResponse = {
    message: string;
};

export async function getPublicProfile(profileId: string): Promise<PublicProfile> {
    return apiRequest<PublicProfile>(`/profiles/public/${profileId}`,
        {
            requiresAuth: false
        }
    );    
}

export async function getMyProfiles(): Promise<Profile[]> {
    return apiRequest<Profile[]>(`/profiles/me`);
}

export async function createProfile(profileData: CreateProfileRequest): Promise<CreateProfileResponse> {
    return apiRequest<CreateProfileResponse>("/profiles/create_profile", {
        method: "POST",
        body: JSON.stringify(profileData),
    });
}

export async function getProfileLinks(profileId: string): Promise<ProfileLink[]> {
    return apiRequest<ProfileLink[]>(`/profile_links/${profileId}/links`);
}

export async function getProfile(profileId: string): Promise<Profile> {
    return apiRequest<Profile>(`/profiles/${profileId}`);
}

export async function createProfileLink(profileId: string, linkData: ProfileLinkCreate): Promise<ProfileLink> {
    return apiRequest<ProfileLink>(`/profile_links/${profileId}/links`, {
        method: "POST",
        body: JSON.stringify(linkData),
    });
}

export async function deleteProfileLink(linkId: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/profile_links/links/${linkId}`, {
        method: "DELETE"
    });
}

export async function updateProfile(profileId: string, profileData: Partial<ProfileUpdate>): Promise<ProfileAdjustmentResponse> {
    return apiRequest<ProfileAdjustmentResponse>(`/profiles/${profileId}/update_profile`, {
        method: "PATCH",
        body: JSON.stringify(profileData),
    });
}

export async function uploadAvatar(profileId: string, file: File): Promise<ProfileAdjustmentResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<ProfileAdjustmentResponse>(`/profile_images/${profileId}/avatar`, {
        method: "POST",
        body: formData,
    });
}

export async function reorderProfileLinks(links: { link_id: string; display_order: number }[]): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/profile_links/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ links }),
    });
}

export async function deleteProfileAvatar(profileId: string): Promise<ProfileAdjustmentResponse> {
    return apiRequest<ProfileAdjustmentResponse>(`/profile_images/${profileId}/avatar`, {
        method: "DELETE"
    });
}

export async function reorderProfiles(profiles: { profile_id: string; display_order: number }[]): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/profiles/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ profiles }),
    });
}