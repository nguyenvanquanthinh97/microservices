import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${ticketId}`).send().expect(404);
});

it("returns the ticket if ticket is found", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "Item 1", price: 10.0 })
    .expect(201);

  await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);
});
