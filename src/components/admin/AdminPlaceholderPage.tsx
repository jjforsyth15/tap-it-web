import styles from "../../styles/admin/AdminPlaceholderPage.module.css";

type AdminPlaceholderPageProps = {
    title: string;
    description: string;
};

function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
    return (
        <section className={styles.placeholderPage}>
            <header className={styles.pageHeader}>
                <p className={styles.eyebrow}>Administration</p>
                <h1>{title}</h1>
                <p>{description}</p>
            </header>

            <div className={styles.placeholderCard}>
                <h2>{title} management</h2>
                <p>
                    This admin section is currently under development.
                </p>
            </div>
        </section>
    );
}

export default AdminPlaceholderPage;