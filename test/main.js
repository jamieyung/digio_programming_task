const assert = require("assert")
const { mkStreamFromArray, mkStreamFromFile, LogReporter } = require("../src/log_reporter.js")

describe("LogReporter", () => {
  it("LogReporter.process_line should work with a representative line from the given data set", () => {
    const stream = mkStreamFromArray([
      '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"'
    ])
    const reporter = new LogReporter(stream)
    reporter.on("end", () => {
      assert.equal(reporter.errors.length, 0)
    })
  })

  it("Should ", () => {
    const stream = mkStreamFromFile("programming-task-example-data.log")
    const reporter = new LogReporter(stream)
    reporter.on("end", () => {
      assert.equal(reporter.errors.length, 0)
    })
  })
})
