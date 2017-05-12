const make_lock = require('./lock.js')
const make_counter = require('./async_counter')
const assert = require('assert')
var sleep = require('sleep-promise')

describe("rosmaro-process-wide-lock", function () {

  it("provides the interface Rosmaro understands", async function () {
    const lock = make_lock()
    const counter = make_counter()

    const synchronized_incr = async () => {
      const unlock = await lock()
      await counter.async_incr()
      await unlock()
    }

    synchronized_incr()
    synchronized_incr()

    await sleep(100)
    counter.tick()
    await sleep(100)
    counter.tick()
    await sleep(100)

    assert.equal(counter.read_value(), 2)
  })

})
