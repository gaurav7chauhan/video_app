import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = e();

const dataLimit = "10kb";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(e.json({ limit: dataLimit }));

app.use(e.urlencoded({ extended: true, limit: dataLimit }));

app.use(e.static("public"));

app.use(cookieParser());

//import routes
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter); //ye users ek tarah se prefix h jo hume next operation pe le jata h
// hume ab bar bar app.use karne ki jarurat nhi pdegi

//http://localhost:8000/api/v1/users/register

export { app };
