import express from "express";
import userRouter from "./routes/users";
import accountRouter from "./routes/account";
import cors from "cors";
import dotenv from "dotenv";
import qrRoute from "./routes/qrRoute";

dotenv.config();

const app = express();
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use(express.json());

app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/vi/", qrRoute);

const PORT = 4000;
app.listen(PORT, () => {
  console.log("server start on port " + PORT);
});
