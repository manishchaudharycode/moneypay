import express from "express";
import userRouter from "./routes/users";
import accountRouter from "./routes/account";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.listen(3000, () => {
  console.log("server start");
});
