import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Result() {
    const t = {
        zh: {
            result: "遊戲結果",
            player: "玩家",
            score: "分數",
        },
        en: {
            result: "Game results",
            player: "Player",
            score: "Score",
        },
    };

    const [result, setResult] = useState({});
    const [lang, setLang] = useState("zh");

    useEffect(() => {
        setLang(sessionStorage.getItem("lang") || "zh");
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const { data } = await axios.get("/api/result");

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
                <title>{t[lang]["result"]}</title>
            </Head>
            <div id="content" className="p-4 w-full">
                <h1>{t[lang]["result"]}:</h1>
                <table className="border-collapse border border-slate-500 w-full">
                    <thead>
                        <tr>
                            <th className="border border-slate-500 px-1 py-2">
                                {t[lang]["player"]}
                            </th>
                            <th className="border border-slate-500 px-1 py-2">
                                {t[lang]["score"]}
                            </th>
                        </tr>
                    </thead>
                    <tbody id="results">
                        {Object.entries(result).map(([, { name, score }], index) => (
                            <tr key={index}>
                                <td className="border border-slate-500 px-1 py-2">{name}</td>
                                <td className="border border-slate-500 px-1 py-2">{score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
