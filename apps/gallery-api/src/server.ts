import express from "express";
import cors from "cors";
import { config } from "./config"
import { initToDoRoutes } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initToDoRoutes(app, "/api/v1");

app.listen(config.PORT, () => console.log(`listening on port ${config.PORT}...`));
