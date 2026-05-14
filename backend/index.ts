import express from "express";
import userRouter from "./routes/users";
import accountRouter from "./routes/account";
import cors from "cors";

const app = express();

app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.listen(3000, () => {
  console.log("server start");
});
