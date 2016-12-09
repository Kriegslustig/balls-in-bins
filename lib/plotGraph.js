const d3 = require('d3')
const jsdom = require('jsdom')
const { Observable: O } = require('rxjs')

/* (data: Array<number>, size?: { width: number, height: number }) => Rx.Observable<string> */
module.exports = (data, { width, height } = { width: 200, height: 200}) =>
  initDom(`<svg></svg>`)
    // d3 expects document to be defined
    .do(window => { global.document = window.document })
    .map(window => {
      const padding = width * (0.2 / data.length)
      const barWidth = (width - padding * data.length) / data.length
      const fontSize = barWidth
      const max = Math.max(...data)
      // estimate label length
      const labelWidth = (data.length.toString().length + max.toString().length) * (fontSize / 1.5) + padding

      const svg = d3.select('svg')
      // set size of svg
      svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('version', '1.1')

      const calcX = (d, i) => i * (barWidth + padding)
      const calcBarHeight = d => d / max * (width - labelWidth)

      const dataEnter =
        svg
          .selectAll('rect')
          .data(data)
          .enter()

      dataEnter
        .append('text')
        .attr('font-size', fontSize)
        .attr('text-anchor', 'end')
        .attr('transform', (d, i) => `translate(${calcX(d, i) + barWidth}, ${200 - labelWidth + padding}) rotate(90)`)
        .text((n, i) => `${i}: ${n}`)
      dataEnter
        .append('rect')
        .attr('height', calcBarHeight)
        .attr('width', barWidth)
        .attr('x', calcX)
        .attr('y', d => 200 - labelWidth - calcBarHeight(d))
        .text(d => d)

      // return the resulting markup
      return d3.select('body').html()
    })

const initDom = (html) => O.create(o => {
  let window
  jsdom.env({
    QuerySelector: true,
    html: html,
    done: (err, newWindow) => {
      window = newWindow
      if (err) return o.error(err)
      o.next(window)
      o.complete()
    }
  })
  return () => { window.close() }
})
