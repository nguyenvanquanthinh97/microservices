import {
  TicketUpdatedEvent,
  Subjects,
  Publisher,
} from "@thinhvqnguyen-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
