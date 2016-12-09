const { Observable: O } = require('rxjs')
const plotGraph = require('./lib/plotGraph')
const { genArr, calculateTotals } = require('./lib/helpers')

const BUCKETS = 10
const BALLS = 100
const TRIES = 100000

const chooseBucket = () =>
  Math.floor(Math.random() * BUCKETS)

const runBallsInBuckets = () =>
  genArr(BALLS)
    .map(chooseBucket)
    .reduce(calculateTotals, genArr(BUCKETS))

// 100 tries
O.range(0, TRIES)
  // 10 buckets with 100 balls
  .map(runBallsInBuckets)
  // get the highest number of balls in a bucket
  .map(buckets => Math.max(...buckets))
  // sum up each possible maximum
  .reduce(calculateTotals, genArr(BALLS))
  .switchMap(arr => plotGraph(arr))
  .subscribe(
    console.log,
    console.error
  )
