type USER = {
  guid: string,
  username: string,
  name: string,
  socket_id: string
}

type USERS = {
  [guid: string]: USER
}

export {
  USERS,
  USER
}