import UserRegistry from "@registries/user_registry";
import { User } from "server/classes"

type USER = User;

type USERS = {
  [guid: string]: USER
}

type HEADERS = {
  [key: string]: string
}

type DATA = any

type REQUEST = {
  headers: HEADERS,
  data: DATA
}

type COOLDOWNS = {
  [key: string]: {
    last_call: number,
    events_over_threshold: number
  }
}

type USER_REGISTRY = UserRegistry;

export {
  USERS,
  USER,
  HEADERS,
  DATA,
  REQUEST,
  COOLDOWNS,
  USER_REGISTRY
}