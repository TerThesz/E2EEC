type USER = {
  guid: string,
  username: string,
  name: string,
  socket_id: string
}

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