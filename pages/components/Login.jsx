import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { v4 as uuid4 } from "uuid";

import styles from "./Login.module.css";

export default function Login() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState("zh");
    const [name, setName] = useState("");

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        if (!localStorage.getItem("clientId")) {
            localStorage.setItem("clientId", uuid4());
        }

        if (localStorage.getItem("lang")) {
            setLanguage(localStorage.getItem("lang") || "zh");
        } else {
            localStorage.setItem("lang", "zh");
        }

        if (localStorage.getItem("name")) {
            if (!params.from) {
                router.push("/waiting");
            }

            setName(localStorage.getItem("name"));
        }
    }, [router]);

    const changeLanguage = (e) => {
        localStorage.setItem("lang", e.target.value);
        i18n.changeLanguage(e.target.value);
        setLanguage(e.target.value);
    };

    const updateName = (e) => {
        localStorage.setItem("name", e.target.value);
        setName(e.target.value);
    };

    const submitForm = () => {
        if (!name) return;
        router.push("/waiting");
    };

    return (
        <form id={styles.content}>
            <label htmlFor="language">{t("selectLanguage")}</label>
            <div id={styles.language}>
                <div>
                    <input
                        type="radio"
                        id="chinese"
                        value="zh"
                        onChange={changeLanguage}
                        checked={language === "zh"}
                    />
                    <label htmlFor="chinese">中文</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="english"
                        value="en"
                        onChange={changeLanguage}
                        checked={language === "en"}
                    />
                    <label htmlFor="English">English</label>
                </div>
            </div>
            <label htmlFor="name">{t("enterName")}</label>
            <input type="text" id={styles.name} value={name} onChange={updateName} />
            <button
                type="submit"
                id={styles.submit}
                onClick={() => submitForm()}
                disabled={!name}
            >
                {t("submit")}
            </button>
        </form>
    );
}
