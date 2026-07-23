export type BetaFeedback = {
    feedback_id: string;
    user_id: string;
    feedback_type: string;
    contact_info: string;
    page_url: string;
    feedback_description: string;
    browser_info: string;
    screen_size: string;
    version: string;
    feedback_status: string;
    created_at: string;
}

export type BetaFeedbackRequest = {
    feedback_type: string;
    feedback_description: string;
    page_url: string;
    contact_info?: string;
    browser_info?: string;
    screen_size?: string;
    version?: string;
};


export type BetaFeedbackResponse = {
    message: string;
    feedback: BetaFeedbackRequest;
};