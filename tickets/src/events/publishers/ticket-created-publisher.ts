import {
  TicketCreatedEvent,
  Subjects,
  Publisher,
} from "@thinhvqnguyen-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
