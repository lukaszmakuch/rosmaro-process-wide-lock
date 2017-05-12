module.exports = () => {
  let count = 0
  let waiting_actions = []

  return {

    async_incr() {
      const incremented_count = count + 1
      return new Promise(resolve => {
        waiting_actions.push(() => {
          count = incremented_count
          resolve()
        })
      })
    },

    tick() {
      const [head, ...tail] = waiting_actions
      if (head) {
        waiting_actions = tail
        head()
      }
    },

    read_value() {
      return count
    }

  }
}
