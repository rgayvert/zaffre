import express from "express";
import cors from "cors";
import { initSequelize } from "./models";
import { initToDoRoutes } from "./routes/todo.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initToDoRoutes(app, initSequelize());

app.listen(3002, () => console.log("listening on port 3002..."));
