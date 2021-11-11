// code from https://github.com/jakubknejzlik/node-timeout-callback/blob/master/index.js

const defaultOptions = {
  isolateFirstArgForTimeoutError: true,
};

export default function callbackTimeout(timeout: any, callback?: any, options?: any) {
  let called = false;

  // Check to see if it's actually an options object.
  if (typeof callback === "object"
    && callback.hasOwnProperty("isolateFirstArgForTimeoutError")
  ) {
    options = callback;
  }

  if (typeof timeout === "function") {
    callback = timeout;
    timeout = 10 * 1000;
  }

  options = { ...defaultOptions, ...options };

  let interval = setTimeout(
    function() {
      if (called) return;
      called = true;
      callback(new Error("callback timeout"));
    },
    timeout
  );

  return function(...args: any[]) {
    if (called) return;
    called = true;
    clearTimeout(interval);

    if (options.isolateFirstArgForTimeoutError) {
      args.unshift(null);
    }

    callback(...args);
  };
}