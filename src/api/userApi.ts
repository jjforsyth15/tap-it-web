import { apiRequest } from "./client";


export type User = {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
};

export function getCurrentUser() {
    return apiRequest<User>("/users/me");
}