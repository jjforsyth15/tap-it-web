import styles from "../styles/HomePage.module.css";

function HomePage() {
    return (
        <div className={styles.homePage}>
            <h1>
                Welcome to TapIt
                <span className={styles.betaBadge}>Beta 2</span>
            </h1>

            <p className={styles.subtitle}>Connect instantly with a simple tap</p>
            <div className={styles.heroBox}>
                <h3>What is TapIt?</h3>
                <p className={styles.description}>TapIt lets you instantly share your contact information, social and professional links, portfolio, and more using a single NFC card.</p>
                <p className={styles.description}>Simply tap your TapIt card on a compatible phone to instantly open your personalized profile.</p>
                <p className={styles.description}>No app or QR code required.</p>
            </div>

            <section>
                <h2>How TapIt Works</h2>
                <ul>
                    <li>Create your account</li>
                    <li>Create one or more profiles</li>
                    <li>Activate your TapIt card</li>
                    <li>Customize your profile with links and contact info</li>
                    <li>Tap your card on a compatible phone to instantly share your profile</li>
                </ul>
            </section>

            <section className={styles.whatsNew}>
                <h2>What's New in Beta 2</h2>

                <h3>Easier sign-in</h3>
                <ul>
                    <li>Sign up or log in with your Google account</li>
                    <li>Link Google to an existing TapIt account</li>
                    <li>Email verification for new accounts</li>
                    <li>Forgot your password? Reset it by email</li>
                </ul>

                <h3>Richer profiles</h3>
                <ul>
                    <li>Add phone numbers and email addresses to your profiles, and choose a primary for each</li>
                    <li>Add a subtitle and organization, like your job title and company</li>
                </ul>

                <h3>Better public profiles</h3>
                <ul>
                    <li>Links and contact info are organized into separate, collapsible sections</li>
                    <li>Contact details stay hidden until a visitor taps to reveal them, with one-tap copy</li>
                    <li>Visitors can save your details straight to their phone's contacts</li>
                </ul>

                <h3>Security</h3>
                <ul>
                    <li>Stronger account protection and a round of security improvements behind the scenes</li>
                </ul>
            </section>

            <details className={styles.recap}>
                <summary>Beta 1 Recap</summary>
                <p>
                    Beta 1 (July 2026) launched TapIt's core experience: accounts, multiple profiles,
                    link management with drag-and-drop ordering, avatar uploads, NFC card activation,
                    and public profile pages you can share with a single tap.
                </p>
            </details>

            <section>
                <h2>Help Shape TapIt</h2>
                <p>
                    TapIt is still in beta.
                    You may encounter some bugs, unfinished features, or the occasional downtime while improvements are being made.
                </p>
                <p>Your feedback is incredibly valuable and will help shape the future of TapIt.</p>
                <p>Feedback can be submitted using the <strong>Beta Feedback</strong> button at the bottom right corner of the page.</p>

                <p>During Beta 2, feedback is especially appreciated on:</p>
                <ul>
                    <li>Signing up and logging in, including Google sign-in and email verification</li>
                    <li>Adding contact info, a subtitle, and an organization to your profiles</li>
                    <li>Public profile pages, including saving a contact</li>
                    <li>Activating TapIt cards</li>
                    <li>Overall usability and experience</li>
                    <li>Any bugs or unexpected behavior</li>
                    <li>Suggestions for new features or improvements</li>
                </ul>
            </section>

            <div className={styles.thankYou}>
                <h3>Thank You!</h3>
                <p>Every bug report, suggestion, and piece of feedback helps to make TapIt better.</p>
            </div>
        </div>
    );
}

export default HomePage
