import { apiRequest, API_BASE_URL } from "./client";
import type {
    Profile,
    PublicProfile,
    ProfileLink,
    ProfileLinkCreate,
    ProfileContact,
    ProfileContactCreate,
    ProfileContactUpdate,
    CreateProfileRequest,
    CreateProfileResponse,
    ProfileUpdate,
    ProfileAdjustmentResponse } from "../types/profile";

type MessageResponse = {
    message: string;
};

export function getProfileVCardUrl(profileId: string): string {
    return `${API_BASE_URL}/profiles/public/${profileId}/vcard`;
}

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

export async function getProfileContacts(profileId: string): Promise<ProfileContact[]> {
    return apiRequest<ProfileContact[]>(`/profile_contacts/${profileId}/contacts`);
}

export async function createProfileContact(profileId: string, contactData: ProfileContactCreate): Promise<ProfileContact> {
    return apiRequest<ProfileContact>(`/profile_contacts/${profileId}/contacts`, {
        method: "POST",
        body: JSON.stringify(contactData),
    });
}

export async function updateProfileContact(contactId: string, contactData: ProfileContactUpdate): Promise<ProfileContact> {
    return apiRequest<ProfileContact>(`/profile_contacts/contacts/${contactId}`, {
        method: "PATCH",
        body: JSON.stringify(contactData),
    });
}

export async function deleteProfileContact(contactId: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/profile_contacts/contacts/${contactId}`, {
        method: "DELETE"
    });
}

export async function reorderProfileContacts(contacts: { contact_id: string; display_order: number }[]): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/profile_contacts/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ contacts }),
    });
}