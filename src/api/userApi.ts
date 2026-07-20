import { apiRequest } from "./client";
import type { User } from "../types/user";

export function getCurrentUser(): Promise<User> {
    return apiRequest<User>("/users/me");
}