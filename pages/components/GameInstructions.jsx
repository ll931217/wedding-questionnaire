import { useTranslation } from "react-i18next";

import styles from "./GameInstructions.module.css";

export const GameInstructions = () => {
    const { t } = useTranslation();

    return (
        <div id={styles.content}>
            <h1>{t("gameIntroduction")}</h1>
            <div id={styles.instructions}>
                <p>{t("instructions1")}</p>
                <p>{t("instructions2")}</p>
                <p>{t("instructions3")}</p>
                <p>{t("instructions4")}</p>
            </div>
            <h3 style={{ textAlign: "center" }}>
                <div id={styles.waiting}>
                    <span className={styles.typewriter}>{t("statusWaiting")}...</span>
                </div>
            </h3>
        </div>
    );
};
