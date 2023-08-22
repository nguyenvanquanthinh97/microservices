import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title",
    price: 10.0,
  });

  await ticket.save();

  const user = global.signin();

  // create the order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order
  const { body: orderFetch } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(orderFetch.id).toEqual(order.id);
  expect(orderFetch.ticket.id).toEqual(ticket.id);
});

it("returns an error if a user tries to fetch another user order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title",
    price: 10.0,
  });

  await ticket.save();

  const user = global.signin();
  const anotherUser = global.signin();

  // create the order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order
  const { body: orderFetch } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", anotherUser)
    .send()
    .expect(401);
});
