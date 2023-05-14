import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors({origin: '*'}), express.json());

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});