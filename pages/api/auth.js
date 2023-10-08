import { v4 as uuidv4 } from "uuid";

import db from "./data";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json({ userId: db.getLoggedInUser() });
    } else if (req.method === "POST") {
        const { username, password } = req.body;

        if (username === "admin" && password === "admin1234") {
            return res.status(200).json({
                userId: db.loginAdmin(uuidv4()),
                message: "Login successful",
            });
        }

        res.status(401).json({ message: "Invalid username or password" });
    } else if (req.method === "DELETE") {
        const { userId } = req.body;

        if (userId === db.getLoggedInUser()) {
            db.logoutAdmin();
            return res.status(200).json({ message: "Logout successful" });
        }

        res.status(401).json({ message: "Not logged in" });
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
