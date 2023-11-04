import { v4 } from "uuid";
import fetch from "./axios.mjs";

const sendResult = async (clientId, name, score) => {
    try {
        const { data } = await fetch.post(
            "/api/questionnaire",
            {
                clientId,
                name,
                score,
            },
            { params: { lang: "zh" } },
        );

        console.log("Result:", data);

        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error(error.response.data);
        } else {
            console.error(error);
        }
    }
};

const answers = {};

for (let i = 0; i < 100; i++) {
    answers[v4()] = {
        name: "client" + i,
        score: Math.round(Math.random() * 100),
    };
}

console.log(
    "Results:",
    await Promise.all(
        Object.entries(answers).map(async ([key, { name, score }]) => {
            return await sendResult(key, name, score);
        }),
    ),
);
