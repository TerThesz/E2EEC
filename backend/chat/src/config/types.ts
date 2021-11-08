import { Socket } from 'socket.io';

type CLIENTS = {
  [username: string]: Socket
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
  CLIENTS,
  PIPELINE,
  PIPELINE_OBJ
}