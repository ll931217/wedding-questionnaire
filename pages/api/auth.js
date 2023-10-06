import { v4 as uuidv4 } from "uuid";

import { getLoggedInUser, loginUser } from "../state";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json({ userId: getLoggedInUser() });
    } else if (req.method === "POST") {
        const { username, password } = req.body;

        if (username === "admin" && password === "admin1234") {
            const userId = uuidv4();
            loginUser(userId);
            res.status(200).json({ userId, message: "Login successful" });
        }

        res.status(401).json({ message: "Invalid username or password" });
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
