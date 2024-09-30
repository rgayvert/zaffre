import { zboolean, zlog, zutil } from ":foundation";
import { Handler, HandlerTarget, EventActionsRecord } from "./Handler";
import { EventType } from "./Listener";

//
// Base class for event handlers.
//

export abstract class EventHandler<L extends Partial<EventType>, E extends Event> extends Handler<E> {
  constructor(protected actions: EventActionsRecord<L, E>, protected active: zboolean) {
    super(true);
  }

  afterSetTarget(target: HandlerTarget): void {
    this.eventTypes().forEach((type) => target.addListenerAction(type, (evt: E) => this.handleOneEvent(evt)));
  }

  eventTypes(): L[] {
    return Object.keys(this.actions) as L[];
  }

  handleOneEvent(evt: Event): void {
    const fn = this.actions[evt.type as L];
    if (fn) {
      fn(evt as E);
    } else {
      zlog.info(`no handler for ${evt.type} in ${this}`); // TODO: can this happen?
    }
  }
}

function extractValidEventActions<L extends Partial<EventType>, E extends Event>(actions: EventActionsRecord<L, E>): EventActionsRecord<L, E> {
  return zutil.withoutUndefinedValues(actions) as EventActionsRecord<L, E>;
}

export abstract class SimpleEventHandler<L extends Partial<EventType>, E extends Event> extends EventHandler<L, E> {
  constructor(protected actions: EventActionsRecord<L, E>, protected active: zboolean) {
    super(extractValidEventActions(actions), active);
  }
}

