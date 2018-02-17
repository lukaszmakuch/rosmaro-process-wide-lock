const makeLock = require('./lock.js').default;
const makeCounter = require('./asyncCounter');
const assert = require('assert');
var sleep = require('sleep-promise');

describe("rosmaro-process-wide-lock", function () {

  it('is synchronous if no lock has been acquired', () => {
    const lock = makeLock();
    lock()();
    lock()();
    lock()();
  });

  it('is async if a lock cannot be acquired', async () => {
    // We have one lock.
    const lock = makeLock();

    // First lock is acquired immediately.
    const firstAttemptUnlock = lock();
    assert(typeof(firstAttemptUnlock) === 'function');

    // Second lock is NOT acquired immediately.
    // The unlock() function returns a Promise instead.
    const secondAttemptUnlockPromise = lock();
    assert(secondAttemptUnlockPromise.then);
    let secondAcquired = false;
    secondAttemptUnlockPromise.then(() => secondAcquired = true);
    assert(!secondAcquired);

    // Unlocking the first lock allows to acquire the second lock.
    firstAttemptUnlock();
    secondAttemptUnlock = await secondAttemptUnlockPromise;
    assert(secondAcquired);

    // Unlocking is always immediate.
    secondAttemptUnlock();
    assert(typeof(lock()) === 'function'); // not a Promise
  });

  it("provides the interface Rosmaro understands", async function () {
    const lock = makeLock();
    const counter = makeCounter();

    const synchronizedIncr = async () => {
      const unlock = await lock();
      await counter.asyncIncr();
      await unlock();
    };

    synchronizedIncr();
    synchronizedIncr();
    synchronizedIncr();

    await sleep(100);
    counter.tick();
    await sleep(100);
    counter.tick();
    await sleep(100);
    counter.tick();
    await sleep(100);

    assert.equal(counter.readValue(), 3);
  })

})
