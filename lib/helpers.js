module.exports = {
  calculateTotals: (m, n) => {
    ++m[n]
    return m
  },

  genArr: (n, x = 0) =>
    Array.from(Array(n)).fill(x),

  untilZero: (hasBeenAboveZero = false, cutOff = false) => (n) => {
    if (cutOff) return false
    if (n === 0) {
      if (hasBeenAboveZero) {
        cutOff = true
        return false
      } else {
        return true
      }
    } else {
      if (!hasBeenAboveZero) hasBeenAboveZero = true
      return true
    }
  }
}
