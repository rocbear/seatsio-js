class Page {
  constructor (items, afterId = null, beforeId = null) {
    this.items = items
    this.nextPageStartsAfter = afterId
    this.previousPageEndsBefore = beforeId
  }

  [Symbol.iterator] () {
    let index = 0
    let charts = this.items
    return {
      next () {
        if (index < charts.length) {
          let chart = charts[index]
          index++
          return { value: chart, done: false }
        } else {
          return { done: true }
        }
      }
    }
  }
}

module.exports = Page
