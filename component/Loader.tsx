import styles from "../styles/Loader.module.css";
export default function Loader({ text }: { text: string }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.message}>{text}</div>
        </div>
    );
}