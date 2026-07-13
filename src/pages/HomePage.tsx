import styles from "../styles/HomePage.module.css";

function HomePage() {
    return (
        <div className={styles.homePage}>
            <h1>
                Welcome to TapIt
                <span className={styles.betaBadge}>Beta 1</span>
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
                    <li>Customize your profile with links</li>
                    <li>Tap your card on a compatible phone to instantly share your profile</li>
                </ul>
            </section>
            
            <section>
            <h2>Beta 1</h2>
                <p>
                    This is an early beta release version of TapIt. 
                    As an early beta, you may encounter some bugs, unfinished features, or the occasional downtime while improvements are being made.
                </p>
                <p>Your feedback is incredibly valuable and will help shape the future of TapIt.</p>
                <p>Feedback can be submitted using the <strong>Beta Feedback</strong> button at the bottom right corner of the page.</p>

                <p>During this beta, feedback is especially appreciated on:</p>
                <ul>
                    <li>Creating and managing profiles</li>
                    <li>Activating TapIt cards</li>
                    <li>Public profile pages</li>
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