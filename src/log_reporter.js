const EventEmitter = require("events")
const fs = require("fs")
const readline = require("readline")
const { Readable } = require("stream")



// Convenience functions for creating LogReporter input =======================

function mkStreamFromArray(arr) {
  const stream = new Readable({ objectMode: true })

  let i = 0;
  let len = arr.length;
  stream._read = () => {
    stream.push(i < len ? arr[i++] : null)
  }

  return stream
}

function mkStreamFromFile(filepath) {
  const readable = fs.createReadStream(filepath)
  const rl = readline.createInterface(readable)
  const ret = new EventEmitter()

  rl.on("line", (line) => ret.emit("data", line))
  rl.on("close", () => {
    try {
      readable.close()
      ret.emit("end")
    } catch (err) {
      ret.emit("error", err)
    }
  })

  return ret
}



// Regexes ====================================================================

const IP = /(?<IP>[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
const USER = /(?<USER>[A-z]*|-)/
const TIMESTAMP = /\[(?<TIMESTAMP>.*)\]/
const URL = /"[A-z]* (http[s]?:\/\/example.net)?(?<URL>.*) HTTP\/\d.\d"/
const LOGLINE = new RegExp(`${IP.source} - ${USER.source} ${TIMESTAMP.source} ${URL.source}`, "i")



// LogReporter ================================================================

class LogReporter extends EventEmitter {

  #lines_processed = 0
  #url_hits = {} // map from url to number of hits
  #ip_address_requests = {} // map from ip address to number of requests from that address
  #errors = []

  constructor(stream) {
    super()

    stream.on("data", this.#process_line)

    stream.on("end", () => {
      this.emit("end")
    })

    stream.on("error", (err) => {
      this.emit("error", err)
    })
  }

  // Private functions ========================================================

  #process_line = (line) => {
    const line_idx = this.#lines_processed
    this.#lines_processed++
    const match = LOGLINE.exec(line)
    if (!match) {
      this.#errors.push({ line: line, line_idx: line_idx })
      return
    }

    if (!match.groups || !match.groups.URL || !match.groups.IP) {
      this.#errors.push({ line: line, line_idx: line_idx })
      return
    }

    this.#inc(this.#url_hits, match.groups.URL)
    this.#inc(this.#ip_address_requests, match.groups.IP)

    this.emit("progress")
  }

  #inc = (map, key) => {
    if (map[key] === undefined) map[key] = 0
    map[key]++
  }

  // Getters ==================================================================

  get lines_processed() {
    return this.#lines_processed
  }

  // Note: could have a counter variable to avoid the O(N) calculation. Omitted for simplicity.
  get n_unique_ip_addresses() {
    return Object.keys(this.#ip_address_requests).length
  }

  // Note: to avoid reference leaking, could return a clone here. Omitted for simplicity.
  get url_hit_counts() {
    return this.#url_hits
  }

  // Note: to avoid reference leaking, could return a clone here. Omitted for simplicity.
  get ip_address_requests() {
    return this.#ip_address_requests
  }

  // Note: to avoid reference leaking, could return a clone here. Omitted for simplicity.
  get errors() {
    return this.#errors
  }
}



// Task-specific reporting logic ==============================================

function calc_specified_stats(reporter) {
  const ret = {}

  ret.n_unique_ip_addresses = reporter.n_unique_ip_addresses

  ret.top_3_most_visited_urls = Object.entries(reporter.url_hit_counts)
    .sort((a, b) => b[1] - a[1]) // sort by n hits in descending order
    .splice(0, 3) // take the top 3
    .map((arr) => { return { url: arr[0], n_hits: arr[1] } })

  ret.top_3_most_active_ip_addresses = Object.entries(reporter.ip_address_requests)
    .sort((a, b) => b[1] - a[1]) // sort by n requests in descending order
    .splice(0, 3) // take the top 3
    .map((arr) => { return { ip: arr[0], n_requests: arr[1] } })

  return ret
}

module.exports = {
  mkStreamFromArray,
  mkStreamFromFile,
  LogReporter,
  calc_specified_stats,
}
