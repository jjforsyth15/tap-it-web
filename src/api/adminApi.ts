import { apiRequest } from "./client";
import type { AdminActionItemResponse, AdminHealthResponse, AdminDashboardSummary } from "../types/admin";

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
    return apiRequest<AdminDashboardSummary>("/admin/dashboard/summary");
}

export async function getActionItems(): Promise<AdminActionItemResponse> {
    return apiRequest<AdminActionItemResponse>("/admin/dashboard/action-items");
}

export async function getAdminHealth(): Promise<AdminHealthResponse> {
    return apiRequest<AdminHealthResponse>("/admin/dashboard/health");
}