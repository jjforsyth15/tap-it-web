import { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../../styles/BetaFeedback.module.css";
import { submitBetafeedback } from "../../api/betaApi";
import { useAuth } from "../../context/authContext";

export default function BetaFeedback() {
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);
    const [issueType, setIssueType] = useState("bug");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [contactMethod, setContactMethod] = useState<"none" | "email" | "phone">("none");

    const currentPage = location.pathname;
    const { user } = useAuth();

    function handleClose() {
        setShowModal(false);
        setIssueType("bug");
        setDescription("");
        setContactInfo("");
        setError("");
        setIsSubmitted(false);
        setContactMethod("none");
    }

    function handleContactMethodChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const method = e.target.value as "none" | "email" | "phone";
        setContactMethod(method);

        if (method === "email")
            setContactInfo(user?.email ?? "");
        else 
            setContactInfo("");
    }

    async function handleSubmitFeedback() {
        if(!description.trim()) {
            setError("Please provide a description of the issue.");
            return;
        }
        
        try {
            setIsSubmitting(true);
            setError("");

            await submitBetafeedback({
                feedback_type: issueType,
                feedback_description: description,
                page_url: currentPage,
                contact_info: contactInfo || undefined,
                browser_info: navigator.userAgent,
                screen_size: `${window.innerWidth}x${window.innerHeight}`,
                version: import.meta.env.VITE_APP_VERSION || "unknown",
            });

            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <button className={styles.feedbackButton} 
            onClick={() => setShowModal(true)}>
                Beta Feedback
            </button>

            {showModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.feedbackModal}>
                        {isSubmitted ? (
                            <div className={styles.successState}>
                                <div className={styles.successIcon}>✓</div>
                                <h2>Thank you for your feedback!</h2>
                                <p>
                                    Your feedback has been submitted successfully. 
                                    Your input is greatly appreciated and will help to improve TapIt.
                                </p>

                                <button 
                                    className={styles.submitButton}
                                    onClick={handleClose}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2>Beta Feedback</h2>
                                <p>
                                    <strong>Report a bug, problem, or suggestion for improvement. </strong>
                                </p>
                                <p className={styles.modalDescription}>
                                    TapIt is still an exclusive beta, so any and all feedback is greatly appreciated.
                                </p>
                                <p className={styles.modalDescription}>
                                    Please provide as much detail as possible. Thank you!
                                </p>

                                <label className={styles.formLabel}>
                                    Current Page
                                </label>

                                {currentPage == "/login" ? (
                                    <p className={styles.currentPage}>Login</p>
                                ) : currentPage == "/register" ? (
                                    <p className={styles.currentPage}>Registration</p>
                                ) : currentPage.startsWith("/public/") ? (
                                    <p className={styles.currentPage}>Public Profile Page</p>
                                ) : currentPage.trim() == "/" ? (
                                    <p className={styles.currentPage}>Home Page</p>
                                ) : (
                                    <p className={styles.currentPage}>{currentPage}</p>
                                )}

                                <label 
                                    className={styles.formLabel}
                                    htmlFor="feedback-type"
                                >
                                    Feedback Type
                                </label>
                                <select
                                    id="feedback-type"
                                    className={styles.formSelect}
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                >
                                    <option value="bug">Bug - Something isn't working as expected</option>
                                    <option value="suggestion">Suggestion - I have an idea for improvement</option>
                                    <option value="other">Other</option>
                                </select>

                                <label className={styles.formLabel}>
                                    Contact - if you would like follow up (optional)
                                </label>
                                <select
                                    className={styles.formSelect}
                                    value={contactMethod}
                                    onChange={handleContactMethodChange}
                                >
                                    <option value="none">No contact requested</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                </select>
                                {contactMethod !== "none" && (
                                    <input 
                                    type={contactMethod === "email" ? "email" : "text"}
                                    className={styles.pageInput}
                                    placeholder="Enter your contact info"
                                    value={contactInfo}
                                    onChange={(e) => setContactInfo(e.target.value)}
                                />
                                )}

                                <label 
                                    className={styles.formLabel}
                                    htmlFor="feedback-description"
                                >
                                    Description - Please describe the issue or suggestion in as much detail as you can.
                                </label>
                                <textarea
                                    id="feedback-description"
                                    className={styles.feedbackTextarea}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue or suggestion..."
                                    rows={6}
                                />

                                {error && <p className={styles.errorMessage}>{error}</p>}

                                <div className={styles.modalActions}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className={styles.submitButton}
                                        onClick={handleSubmitFeedback}
                                        disabled={isSubmitting || !description.trim()}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}