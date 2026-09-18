import { useEffect, useState } from "react";
import { getActionItems, getAdminDashboardSummary, getAdminHealth } from "../../api/adminApi";
import AdminActionItemCard from "../../components/admin/AdminActionItemCard";
import AdminHealthCard from "../../components/admin/AdminHealthCard";
import AdminStatCard from "../../components/admin/AdminStatCard";
import type { AdminActionItem, AdminDashboardSummary, AdminHealthResponse } from "../../types/admin";
import styles from "../../styles/admin/AdminDashboardPage.module.css";

function AdminDashboardPage() {
    const [dashboardSummary, setDashboardSummary] = useState<AdminDashboardSummary | null>(null);
    const [actionItems, setActionItems] = useState<AdminActionItem[]>([]);
    const [health, setHealth] = useState<AdminHealthResponse | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            try {
                setIsLoading(true);
                setError("");

                const [dashboardSummary, actionItemData, healthData] = await Promise.all([
                    getAdminDashboardSummary(),
                    getActionItems(),
                    getAdminHealth()
                ]);

                if (!cancelled) {
                    setDashboardSummary(dashboardSummary);
                    setHealth(healthData);
                    setActionItems(actionItemData.action_items);
                }
                
            } catch (err) {
                if (!cancelled) 
                    setError(err instanceof Error ? err.message : "Unable to load admin dashboard.");
            } finally {
                if (!cancelled) 
                    setIsLoading(false);
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    function formatTimestamp(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    if (isLoading) {
        return (
            <section className={styles.adminDashboard}>
                <p className={styles.loadingMessage}>Loading admin dashboard...</p>
            </section>
        );
    }

    if (error || !dashboardSummary || !health) {
        return (
            <section className={styles.adminDashboard}>
                <div className={styles.errorState} role="alert">
                    <h1>Unable to load admin dashboard</h1>
                    <p>{error || "Could not load admin dashboard data."}</p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.adminDashboard}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>
                        Administration
                    </p>

                    <h1>Dashboard Overview</h1>

                    <p className={styles.pageDescription}>
                        Monitor the current state of TapIt and review items that require administrative attention.
                    </p>
                </div>
            </header>

            <section className={styles.statsSection} aria-labelledby="platform-summary-title">
                <div className={styles.sectionHeader}>
                    <div>
                        <h2 id="platform-summary-title">Platform Summary</h2>

                        <p>Current totals across the TapIt platform as of: {formatTimestamp(health.timestamp)}</p>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <AdminStatCard
                        label="Total Users"
                        value={dashboardSummary.total_users}
                        description="Registered accounts"
                    />

                    <AdminStatCard
                        label="Total Profiles"
                        value={dashboardSummary.total_profiles}
                        description="Across all users"
                    />

                    <AdminStatCard 
                        label="Total Cards"
                        value={dashboardSummary.total_cards}
                        description={`${dashboardSummary.active_cards.toLocaleString()} active | ${dashboardSummary.inactive_cards.toLocaleString()} inactive | ${dashboardSummary.lost_cards.toLocaleString()} lost`}
                    />

                    <AdminStatCard
                        label="Feedback Submissions"
                        value={dashboardSummary.total_feedback}
                        description={`${dashboardSummary.open_feedback.toLocaleString()} open | ${dashboardSummary.in_progress_feedback.toLocaleString()} in progress | ${dashboardSummary.resolved_feedback.toLocaleString()} resolved`}
                    />
                </div>
            </section>
            
            <div className={styles.dashboardColumns}>
                <section className={styles.actionItemsSection} aria-labelledby="action-items-title">
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 id="action-items-title">Action Items</h2>
                            <p>Items that require administrative attention.</p>
                        </div>

                        {actionItems.length > 0 && (
                            <span className={styles.actionTotal}>
                                {actionItems.length}
                            </span>
                        )}
                    </div>

                    {actionItems.length > 0 ? (
                        <div className={styles.actionItemsList}>
                            {actionItems.map((item) => (
                                <AdminActionItemCard
                                    key={item.action_type}
                                    actionItem={item}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>
                                There are currently no administrative action items that require attention.
                            </p>
                        </div>
                    )}
                </section>

                <AdminHealthCard health={health} />
            </div>
        </section>
    );
}

export default AdminDashboardPage;