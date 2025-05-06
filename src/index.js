import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" });

connectDB()











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
