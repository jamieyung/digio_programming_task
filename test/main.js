const assert = require("assert")
const LR = require("../src/log_reporter.js")

describe("LogReporter", () => {
  it("LogReporter.process_line should work with a representative line from the given data set", () => {
    const stream = LR.mkStreamFromArray([
      '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"'
    ])
    const reporter = new LR.LogReporter(stream)
    reporter.on("end", () => {
      assert.equal(reporter.errors.length, 0)
      assert.equal(reporter.lines_processed, 1)

      const stats = LR.calc_specified_stats(reporter)

      assert.equal(stats.n_unique_ip_addresses, 1)

      assert.equal(stats.top_3_most_visited_urls.length, 1)
      assert.equal(stats.top_3_most_visited_urls[0].url, "/intranet-analytics/")
      assert.equal(stats.top_3_most_visited_urls[0].n_hits, 1)

      assert.equal(stats.top_3_most_active_ip_addresses.length, 1)
      assert.equal(stats.top_3_most_active_ip_addresses[0].ip, "177.71.128.21")
      assert.equal(stats.top_3_most_active_ip_addresses[0].n_requests, 1)
    })
  })

  it("Should record an error for badly formatted lines", () => {
    const line = "I am a badly formatted line"
    const stream = LR.mkStreamFromArray([line])
    const reporter = new LR.LogReporter(stream)
    reporter.on("end", () => {
      assert.equal(reporter.errors.length, 1)
      assert.equal(reporter.lines_processed, 1)

      assert.equal(reporter.errors[0].line, line)
      assert.equal(reporter.errors[0].line_idx, 0)
    })
  })

  it("Should not emit a progress event for badly formatted lines", () => {
    const line = "I am a badly formatted line"
    const stream = LR.mkStreamFromArray([line])
    const reporter = new LR.LogReporter(stream)

    let progress_count = 0
    reporter.on("progress", () => progress_count++)
    reporter.on("end", () => assert.equal(progress_count, 0))
  })

  it("Should report the correct stats", () => {
    const stream = LR.mkStreamFromFile("programming-task-example-data.log")
    const reporter = new LR.LogReporter(stream)
    reporter.on("end", () => {
      assert.equal(reporter.errors.length, 0)
      assert.equal(reporter.lines_processed, 23)

      const stats = LR.calc_specified_stats(reporter)

      assert.equal(stats.n_unique_ip_addresses, 11)

      assert.equal(stats.top_3_most_visited_urls.length, 3)
      assert.equal(stats.top_3_most_visited_urls[0].url, "/faq/")
      assert.equal(stats.top_3_most_visited_urls[0].n_hits, 2)
      assert.equal(stats.top_3_most_visited_urls[1].url, "/docs/manage-websites/")
      assert.equal(stats.top_3_most_visited_urls[1].n_hits, 2)
      assert.equal(stats.top_3_most_visited_urls[2].url, "/intranet-analytics/")
      assert.equal(stats.top_3_most_visited_urls[2].n_hits, 1)

      assert.equal(stats.top_3_most_active_ip_addresses.length, 3)
      assert.equal(stats.top_3_most_active_ip_addresses[0].ip, "168.41.191.40")
      assert.equal(stats.top_3_most_active_ip_addresses[0].n_requests, 4)
      assert.equal(stats.top_3_most_active_ip_addresses[1].ip, "177.71.128.21")
      assert.equal(stats.top_3_most_active_ip_addresses[1].n_requests, 3)
      assert.equal(stats.top_3_most_active_ip_addresses[2].ip, "50.112.00.11")
      assert.equal(stats.top_3_most_active_ip_addresses[2].n_requests, 3)
    })
  })

  it("Should emit progress events for each line before the end event", () => {
    const stream = LR.mkStreamFromFile("programming-task-example-data.log")
    const reporter = new LR.LogReporter(stream)
    let progress_count = 0
    reporter.on("progress", () => progress_count++)
    reporter.on("end", () => assert.equal(progress_count, 23))
  })
})
