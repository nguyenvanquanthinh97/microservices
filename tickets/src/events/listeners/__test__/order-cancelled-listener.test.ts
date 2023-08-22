import { OrderCancelledEvent } from "@thinhvqnguyen-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: ticket.orderId!,
    version: ticket.version,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, message };
};

it("order cancelled and publish the event, and the ticket should be no-longer booked", async () => {
  const { listener, ticket, data, message } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(message.ack).toBeCalled();
});
