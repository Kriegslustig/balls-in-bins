module.exports = {
  calculateTotals: (m, n) => {
    ++m[n]
    return m
  },

  genArr: (n, x = 0) =>
    Array.from(Array(n)).fill(x)
}
