import { apiRequest } from "./client";
import type { User } from "../types/user";

export function getCurrentUser() {
    return apiRequest<User>("/users/me");
}