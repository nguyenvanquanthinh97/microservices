import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@thinhvqnguyen-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
