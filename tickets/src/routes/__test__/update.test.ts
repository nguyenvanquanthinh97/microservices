import request from "supertest";
import mongoose, { mongo } from "mongoose";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const createTicket = (cookie: string[] = global.signin()) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "item's title",
      price: 10,
    })
    .expect(201);
};

it("returns a 404 if the ticket is not existed", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signin())
    .send({ title: "Updated Title", price: 10.0 })
    .expect(404);
});

it("returns a 401 if the ticket is not authenticated", async () => {
  const ticketResponse = await createTicket();
  const ticketId = ticketResponse.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ title: "Updated Title", price: 10.0 })
    .expect(401);
});

it("returns a 401 if the ticket is not owned by the user", async () => {
  const ticketResponse = await createTicket();
  const ticketId = ticketResponse.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signin())
    .send({ title: "Updated Title", price: 10.0 })
    .expect(401);
});

it("returns a 400 if the ticket is given invalid title or invalid price", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);
  const ticketId = response.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 10.0 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({ title: "Updated Title", price: -10.0 })
    .expect(400);
});

it("returns an updated ticket if given valid inputs", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);
  const ticketId = response.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({ title: "Updated Title", price: 10.0 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual("Updated Title");
  expect(ticketResponse.body.price).toEqual(10.0);
});

it("publish an event", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);
  const ticketId = response.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({ title: "Updated Title", price: 10.0 })
    .expect(200);

  await request(app).get(`/api/tickets/${ticketId}`).send().expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects update if the ticket is already reserved", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Updated Title", price: 10.0 })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${ticket!.id}`)
    .set("Cookie", cookie)
    .send({ title: "Updated Title", price: 10.0 })
    .expect(400);
});
