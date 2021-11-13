import EventRegistryClass from "./event_registry";
import UserRegistryClass from "./user_registry";

const UserRegistry = new UserRegistryClass();
const EventRegistry = new EventRegistryClass();

export { EventRegistry, UserRegistry };