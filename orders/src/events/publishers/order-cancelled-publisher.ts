import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@thinhvqnguyen-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
