const fs = require('fs')

const users = JSON.parse(fs.readFileSync('./ahoj.json'));

console.log(findNames('smolswosdn'));

function findNames(data) {
  const usernames = [];
  loop();
  function loop(min_percentage = .5) {
    for (const username in users) {
      const percentage = similarity(data, username);
  
      if (percentage > min_percentage) {
        usernames.push({username, percentage});
      }

      if (usernames.length >= 5) {
        break;
      }
    }
  }

  if (usernames.length < 5) loop(.3);

  return orderByPercentage(usernames);
}

function orderByPercentage(usernames) {
  usernames.sort((a, b) => {
    if (a.percentage > b.percentage) {
      return -1;
    }
    if (a.percentage < b.percentage) {
      return 1;
    }
    return 0;
  });

  return usernames.map(username => username.username);
}

function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  let longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }

  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
}

function editDistance(s1, s2) {
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