import fetch from "./axios.mjs";

const getResults = async () => {
    try {
        const { data } = await fetch.get("/api/result");

        console.log("Results:", data);

        return data;
    } catch (error) {
        console.error(error);
    }
};

console.log(
    "Results:",
    await Promise.all(
        Array.from({ length: 100 }).map(async () => await getResults()),
    ),
);
