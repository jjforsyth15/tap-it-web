export type BetaFeedbackRequest = {
    feedback_type: string;
    feedback_description: string;
    page_url: string;
    contact_info?: string;
    browser_info?: string;
    screen_size?: string;
    version?: string;
};
