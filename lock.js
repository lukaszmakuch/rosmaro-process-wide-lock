module.exports = () => {
  let locked = []

  return async () => {
    let unlock
    const its_lock = new Promise(resolve => unlock = resolve)
    const previously_locked = Promise.all(locked)
    locked.push(its_lock)
    await previously_locked
    return async () => unlock()
  }
}
