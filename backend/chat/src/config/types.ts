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

export {
  USERS,
  USER,
  HEADERS,
  DATA,
  REQUEST
}