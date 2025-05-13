import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./env" });

connectDB()
.then((response) => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port: ${process.env.PORT}`)
  })
  app.on("error", err => {
    console.log("ERROR:", err)
    throw err
  })
})
.catch(err => {
  console.log(`MONGO_DB connection failed: ${err}`)
})











/*
import e from "express";

const app = e()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.on("error", (err) => {
      console.error(`ERROR: ${err}`);
      throw err;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
})();
*/
