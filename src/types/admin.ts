export type AdminDashboardSummary = {
    total_users: number;
    total_profiles: number;
    total_cards: number;
    active_cards: number;
    inactive_cards: number;
    lost_cards: number;
    total_feedback: number;
    open_feedback: number;
    in_progress_feedback: number;
    resolved_feedback: number;
};

export type AdminActionItemType = 
    | "pending_feedback"
    | "unassigned_cards"
    | "lost_cards"
    | "inactive_users"
    | "card_requests";

export type AdminActionItemPriority = "high" | "medium" | "low";

export type AdminActionItem = {
    action_type: AdminActionItemType;
    label: string;
    count: number;
    priority: AdminActionItemPriority;
    target_path: string;
};

export type AdminDashboardResponse = {
    summary: AdminDashboardSummary;
    action_items: AdminActionItem[];
};

export type ServiceHealthStatus = "healthy" | "degraded" | "unhealthy";

export type AdminHealthResponse = {
    overall_status: ServiceHealthStatus;
    database_status: ServiceHealthStatus;
    api_status: ServiceHealthStatus;
    environment: string;
    version: string;
    timestamp: string;
};

export type AdminActionItemResponse = {
    action_items: AdminActionItem[];
    total_action_items: number;
}