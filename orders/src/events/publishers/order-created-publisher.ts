import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@thinhvqnguyen-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
