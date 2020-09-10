import { createContext } from "react";
import { EventContextState } from "./event-types";

const EventContext = createContext<EventContextState>({});

export default EventContext;
