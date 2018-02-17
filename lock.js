var LOCKED = 3, UNLOCKED = 4;

module.exports = function () {
  var locks, currIndex, listeners;

  var reset = function () {
    locks = [];
    currIndex = 0;
    listeners = [];
  };
  reset();

  var isUnlocked = function (lockStatus) {return lockStatus === UNLOCKED;};

  var unlockedAllUpTo = function (index) {
    return locks
      .slice(0, index + 1)
      .every(isUnlocked);
  } 

  var whenResolvedUpTo = function (index, res) {
    if (unlockedAllUpTo(index)) {
      return res;
    } else {
      return new Promise(function (resolve) {
        listeners[index] = resolve;
      }).then(function () {return res});
    }
  };

  var gc = function () {
    if (locks.every(isUnlocked)) {
      reset();
    }
  };

  var unlock = function (index) {
    locks[index] = UNLOCKED;
    var allUnlocked = unlockedAllUpTo(index);
    if (allUnlocked && listeners[index]) listeners[index]();
    gc();
  };

  var lock = function () {
    locks[currIndex] = LOCKED;
    var prevIndex = currIndex - 1;
    var acquiredIndex = currIndex;
    currIndex++;
    var unlockFn = function () {unlock(acquiredIndex);};
    return whenResolvedUpTo(prevIndex, unlockFn);
  };

  return lock;
};