module.exports = () => {
  let count = 0;
  let waitingActions = [];

  return {

    asyncIncr() {
      const incrementedCount = count + 1;
      return new Promise(resolve => {
        waitingActions.push(() => {
          count = incrementedCount;
          resolve();
        })
      })
    },

    tick() {
      const [head, ...tail] = waitingActions;
      if (head) {
        waitingActions = tail;
        head();
      }
    },

    readValue() {
      return count;
    }

  }
};
