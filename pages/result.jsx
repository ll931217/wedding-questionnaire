import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Result() {
    const { t } = useTranslation();

    const [result, setResult] = useState({});

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const { data } = await axios.get("/api/questionnaire", {
                    params: {
                        lang: sessionStorage.getItem("lang") || "zh",
                        result: true,
                    },
                });

                setResult(data);
            } catch (error) {
                console.error(error);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <Head>
                <title>{t("result")}</title>
            </Head>
            <div id="content" className="p-4 w-full">
                <h1>{t("result")}:</h1>
                <table className="border-collapse border border-slate-500 w-full">
                    <thead>
                        <tr>
                            <th className="border border-slate-500">{t("player")}</th>
                            <th className="border border-slate-500">{t("score")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(result).map(([, { name, score }], index) => (
                            <tr key={index}>
                                <td className="border border-slate-500">{name}</td>
                                <td className="border border-slate-500">{score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
