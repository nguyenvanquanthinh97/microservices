import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@thinhvqnguyen-tickets/common";

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { IndexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true); // Trust the nginx ingress proxy
app.use(bodyParser.json());

app.use(
  cookieSession({
    signed: false, // disable the encryption of cookies
    secure: process.env.NODE_ENV !== "test", // Only receive session-cookie from https request
  })
);

app.use(currentUser);

app.use(
  "/api/tickets",
  createTicketRouter,
  showTicketRouter,
  IndexTicketRouter,
  updateTicketRouter
);

app.use("/", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
