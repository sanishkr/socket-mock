/**
 * Dummy values and methods to generate random names,
 * colors and messages
 */

const names = ["John", "Sam", "Peter", "Rick", "Morty", "Sanish", "Not Sanish"];
const messages = [
  "wohoo",
  "well, hello there",
  "are you talking again",
  "why so serious?",
  "Lol",
  "Lol no",
  "WTF dude, Lol",
  "Lol lol",
  "shut up!!"
];
const colors = [
  "#ddd",
  "#111",
  "yellow",
  "orange",
  "aqua",
  "brown",
  "green",
  "blue",
  "purple",
  "gray"
];

const pickAName = () => {
  return names[Math.floor(Math.random() * names.length)];
};

const pickAMsg = () => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const pickAColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const justToBeSafe = 5 * 60 * 1000;

/**
 * Mock Implementation of Socket
 */

function Socket() {
  this.subscribers = new Map();
  this.timers = new Map();
}

const disconnect = function (eventName, cb, timerId) {
  const cbMap = this.subscribers.get(eventName);
  clearInterval(timerId);
  if (cbMap.has(cb) <= 1) {
    cbMap.delete(cb);
  } else {
    cbMap.set(cb, cbMap.get(cb) - 1);
  }
};

Socket.prototype.On = function (eventName, cb) {
  const timerId = setInterval(() => {
    this.send(eventName, {
      type: "new-message",
      body: pickAMsg(),
      user: {
        name: pickAName(),
        color: pickAColor()
      }
    });
    // console.log("hello", pickAName(), pickAColor(), pickAMsg());
  }, Math.random() * 2000 + 2000);
  if (timerId) {
    clearInterval(justToBeSafe);
  }

  if (this.subscribers.has(eventName)) {
    const cbMap = this.subscribers.get(eventName);
    if (cbMap.has(cb)) {
      cbMap.set(cb, cbMap.get(cb) + 1);
    } else {
      cbMap.set(cb, 1);
    }
  } else {
    const cbMap = new Map();
    cbMap.set(cb, 1);
    this.subscribers.set(eventName, cbMap);
    this.timers.set(eventName, timerId);
  }

  return {
    // disconnect: disconnect.bind(this, eventName, cb)
    disconnect: disconnect.bind(this, eventName, cb, timerId)
  };
};

Socket.prototype.send = function (eventName, ...args) {
  const subs = this.subscribers.get(eventName);
  // console.log(subs);
  if (subs) {
    for (let [cb, count] of subs.entries()) {
      for (let i = 0; i < count; i++) {
        cb.apply(null, args);
      }
    }
  }
};

/**
 * Usage:
 * use new to create new instance
 * use methods `On`, `send`, `disconnect`
 */
const socket = new Socket();
console.log(socket);

const cb1 = (...args) => {
  console.log(args);
};
const sub1 = socket.On("event1", cb1);

setTimeout(() => {
  socket.send("event1", {
    type: "new-message",
    body: "hi",
    user: {
      name: "sns",
      color: "#000"
    }
  });
}, 8000);

/**
 * make sure to disconnect subscribers during unmounting
 */
setTimeout(() => {
  sub1.disconnect();
}, 15000);
