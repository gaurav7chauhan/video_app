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

export { app };
