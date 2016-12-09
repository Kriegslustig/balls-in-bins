const { Observable: O } = require('rxjs')
const plotGraph = require('./lib/plotGraph')
const { genArr, calculateTotals, untilZero } = require('./lib/helpers')

const BINS = 10
const BALLS = 1000
const TRIES = 100000

const chooseBin = () =>
  Math.floor(Math.random() * BINS)

const runBallsInBins = () =>
  genArr(BALLS)
    .map(chooseBin)
    .reduce(calculateTotals, genArr(BINS))

// 100 tries
O.range(0, TRIES)
  // 10 bins with 100 balls
  .map(runBallsInBins)
  // get the highest number of balls in a bin
  .map(bins => Math.max(...bins))
  // sum up each possible maximum
  .reduce(calculateTotals, genArr(BALLS))
  .map(arr => arr.filter(untilZero()))
  .switchMap(arr => plotGraph(arr))
  .subscribe(
    console.log,
    console.error
  )
