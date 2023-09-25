import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import router from "./wishlistRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 4000;

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`); 

app.use("/countries", router);

const server = app.listen(port, () => console.log(`Server running on ${port}`));
