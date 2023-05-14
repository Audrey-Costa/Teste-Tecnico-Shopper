import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routes/router";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";


const app = express();
app.use(cors({origin: '*'}), express.json(), router);
app.use(errorHandlerMiddleware);

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});