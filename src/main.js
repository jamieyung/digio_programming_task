const LR = require("../src/log_reporter.js")

const stream = LR.mkStreamFromFile("programming-task-example-data.log")
const reporter = new LR.LogReporter(stream)
reporter.on("end", () => {
  const stats = LR.calc_specified_stats(reporter)

  console.log("Number of unique IP addresses ================================")
  console.log("    " + stats.n_unique_ip_addresses)

  console.log("\nTop 3 most visited URLs ======================================")
  for (const x of stats.top_3_most_visited_urls) {
    console.log("    " + x.url + " (" + x.n_hits + " hit(s))")
  }

  console.log("\nTop 3 most active IP addresses ===============================")
  for (const x of stats.top_3_most_active_ip_addresses) {
    console.log("    " + x.ip + " (" + x.n_requests + " request(s))")
  }
})
