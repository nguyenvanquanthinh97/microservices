import express, { Request, Response } from "express";

import { NotFoundError } from "@thinhvqnguyen-tickets/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  const ticketId = req.params.id;

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
