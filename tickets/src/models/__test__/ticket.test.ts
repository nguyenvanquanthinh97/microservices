import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    title: "ticket 1",
    price: 5.0,
    userId: "123456",
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make 2 seperate changes to the tickets we found
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetch ticket
  await firstInstance!.save();

  // save the second fetch ticket
  await expect(secondInstance!.save()).rejects.toThrow();
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "ticket 1",
    price: 5.0,
    userId: "123456",
  });

  await ticket.save();
  expect(ticket.version).toBe(0);
  await ticket.save();
  expect(ticket.version).toBe(1);
  await ticket.save();
  expect(ticket.version).toBe(2);
});
