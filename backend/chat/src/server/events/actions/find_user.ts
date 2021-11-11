import status_codes from "@config/status_codes";
import { REQUEST, USER, USERS } from "@config/types";
import server from "@server";
import { EventInterface } from "server/interfaces";
import { RequestTypeMiddleware } from "server/middleware";
import { eventError } from "server/utils";
import { Socket } from "socket.io";

const seen_messages: EventInterface = {
  name: 'find user',

  data_types: 'string',

  middleware: RequestTypeMiddleware,

  handler(request: REQUEST, cb: Function, socket: Socket, users: USERS, user: USER): void {
    const data = request.data;
    if(!data) return eventError(socket, status_codes.BAD_DATA_FORMAT, cb);

    const usernames: string[] = [];
    const raw_usernames: Array<{ username: string, percentage: number }> = Array<{ username: string, percentage: number }>();

    for (const guid in users) {
      const username = users[guid].username;
      const percentage = similarity(data, username);
  
      if (percentage > .3 && !raw_usernames.includes({username, percentage})) {
        raw_usernames.push({username, percentage});
      }

      if (raw_usernames.length >= 5) {
        break;
      }
    }

    cb(orderByPercentage(raw_usernames));

    function orderByPercentage(raw_usernames:  Array<{ username: string, percentage: number }>){
      raw_usernames.sort((a, b) => {
        if (a.percentage > b.percentage) {
          return -1;
        }
        if (a.percentage < b.percentage) {
          return 1;
        }
        return 0;
      });
    
      raw_usernames.forEach(username => usernames.push(username.username));
      return usernames;
    }

    function similarity(s1: string, s2: string) {
      const longer = s1.length > s2.length ? s1 : s2;
      const shorter = s1.length > s2.length ? s2 : s1;
    
      let longerLength = longer.length;
      if (longerLength == 0) {
        return 1.0;
      }
    
      return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
    }

    function editDistance(s1: string, s2: string) {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();
    
      const costs = new Array();
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
          if (i == 0)
            costs[j] = j;
          else {
            if (j > 0) {
              let newValue = costs[j - 1];
              if (s1.charAt(i - 1) != s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue),
                  costs[j]) + 1;
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0)
          costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    }
  }
};

export default seen_messages; 