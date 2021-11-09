import { Socket } from 'socket.io';

type STATUS = 'online' | 'offline' | 'busy' | 'away';

type USERS = {
  [username: string]: {
    username: string,
    socket: Socket
  }
  // TODO: more things
}

type USER = {
  username: string,
  socket: Socket
}


type PIPELINE = Array<{
  id: string,
  sockets: Array<Socket>,
  owner: string,
  admins: Array<string>
}>

type PIPELINE_OBJ = {
  id: string,
  sockets: Array<Socket>,
  owner: string,
  admins: Array<string>
}

export {
  USERS,
  USER,
  PIPELINE,
  PIPELINE_OBJ
}