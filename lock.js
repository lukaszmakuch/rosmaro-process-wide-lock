const LOCKED = 3, UNLOCKED = 4;

module.exports = () => {
  let locks, currIndex, listeners;

  const reset = () => {
    locks = [];
    currIndex = 0;
    listeners = [];
  };
  reset();

  const isUnlocked = lockStatus => lockStatus === UNLOCKED;

  const unlockedAllUpTo = index => locks
    .slice(0, index + 1)
    .every(isUnlocked);

  const whenResolvedUpTo = (index, res) => {
    if (unlockedAllUpTo(index)) {
      return res;
    } else {
      return new Promise(resolve => {
        listeners[index] = resolve;
      }).then(() => res);
    }
  };

  const gc = () => {
    if (locks.every(isUnlocked)) {
      reset();
    }
  };

  const unlock = index => {
    locks[index] = UNLOCKED;
    const allUnlocked = unlockedAllUpTo(index);
    if (allUnlocked && listeners[index]) listeners[index]();
    gc();
  };

  const lock = () => {
    locks[currIndex] = LOCKED;
    const prevIndex = currIndex - 1;
    const acquiredIndex = currIndex;
    currIndex++;
    const unlockFn = () => unlock(acquiredIndex);
    return whenResolvedUpTo(prevIndex, unlockFn);
  };

  return lock;
};