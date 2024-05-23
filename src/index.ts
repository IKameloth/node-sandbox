import express from "express";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.info(`Server is running on http://localhost:${process.env.PORT}/`);
});

mongoose.Promise = Promise;
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@node-sandbox-cluster.9qwuq8h.mongodb.net/?retryWrites=true&w=majority&appName=node-sandbox-cluster`
);
mongoose.connection.on("connected", () =>
  console.log("connected with mongodb")
);
mongoose.connection.on("error", (error) =>
  console.log("error connection with mongodb =>", error)
);

app.use("/", routes());
