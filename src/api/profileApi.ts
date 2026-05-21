import { apiRequest } from "./client";
import type { PublicProfile } from "../types/profile";

export async function getPublicProfile(profileId: string) {
    return apiRequest<PublicProfile>(`/profiles/public/${profileId}`);    
}