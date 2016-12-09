const d3 = require('d3')
const jsdom = require('jsdom')
const { Observable: O } = require('rxjs')

/* (data: Array<number>, size?: { width: number, height: number }) => Rx.Observable<string> */
module.exports = (data, { width, height } = { width: 200, height: 200}) =>
  initDom(`<svg></svg>`)
    // d3 expects document to be defined
    .do(window => { global.document = window.document })
    .map(window => {
      const padding = height * (0.2 / data.length)
      const barHeight = (height - padding * data.length) / data.length
      const fontSize = barHeight
      const max = Math.max(...data)
      // estimate label length
      const labelWidth = (data.length.toString().length + max.toString().length) * (fontSize / 1.5) + padding

      const svg = d3.select('svg')
      // set size of svg
      svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('version', '1.1')

      const calcY = (d, i) => i * (barHeight + padding)

      const dataEnter =
        svg
          .selectAll('rect')
          .data(data)
          .enter()

      dataEnter
        .append('text')
        .attr('y', (d, i) => calcY(d, i) + barHeight)
        .attr('x', 0)
        .attr('font-size', fontSize)
        .text((n, i) => `${i}: ${n}`)
      dataEnter
        .append('rect')
        .attr('width', d => d / max * (width - labelWidth))
        .attr('height', barHeight)
        .attr('y', calcY)
        .attr('x', labelWidth)
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
