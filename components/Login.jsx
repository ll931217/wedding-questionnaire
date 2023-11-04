import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuid4 } from "uuid";

import styles from "./Login.module.css";

export default function Login() {
    const router = useRouter();
    const [language, setLanguage] = useState("zh");
    const [name, setName] = useState("");

    const t = {
        zh: {
            enterName: "您的姓名",
            selectLanguage: "選擇語言",
            submit: "提交",
        },
        en: {
            enterName: "Your name",
            selectLanguage: "Select language",
            submit: "Submit",
        },
    };

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        if (!sessionStorage.getItem("clientId")) {
            sessionStorage.setItem("clientId", uuid4());
        }

        if (sessionStorage.getItem("lang")) {
            setLanguage(sessionStorage.getItem("lang") || "zh");
        } else {
            sessionStorage.setItem("lang", "zh");
        }

        if (sessionStorage.getItem("name")) {
            if (!params.from) {
                router.push("/waiting");
            }

            setName(sessionStorage.getItem("name"));
        }
    }, [router]);

    const changeLanguage = (e) => {
        sessionStorage.setItem("lang", e.target.value);
        setLanguage(e.target.value);
    };

    const updateName = (e) => {
        sessionStorage.setItem("name", e.target.value);
        setName(e.target.value);
    };

    const submitForm = () => {
        if (!name) return;
        router.push("/waiting");
    };

    return (
        <form id={styles.content}>
            <label htmlFor="language">{t[language]["selectLanguage"]}</label>
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
            <label htmlFor="name">{t[language]["enterName"]}</label>
            <input type="text" id={styles.name} value={name} onChange={updateName} />
            <button
                type="submit"
                id={styles.submit}
                onClick={() => submitForm()}
                disabled={!name}
            >
                {t[language]["submit"]}
            </button>
        </form>
    );
}
