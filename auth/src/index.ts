import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  console.log("Auth starting up....");
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Auth is listening on port 3000");
  });
};

start();
