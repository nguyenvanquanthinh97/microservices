import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@thinhvqnguyen-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
