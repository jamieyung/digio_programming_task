const EventEmitter = require("events")
const fs = require("fs")
const readline = require("readline")
const { Readable } = require("stream")

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

class LogReporter extends EventEmitter {

  // Private state ============================================================

  #unique_ip_addresses = {} // map from ip address to true (just a set)
  #url_hits = {} // map from url to number of hits
  #ip_address_hits = {} // map from ip address to number of requests from that address
  #errors = []

  // Constructor ==============================================================

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
    console.log(line)
    this.emit("progress")
  }

  // Getters ==================================================================

  get unique_ip_addresses() {
    return Object.keys(this.#unique_ip_addresses)
  }

  // Note: could have a counter variable to avoid the O(N) calculation. Omitted for simplicity.
  get n_unique_ip_addresses() {
    return Object.keys(this.#unique_ip_addresses).length
  }

  // Note: to avoid reference leaking, could return a clone here. Omitted for simplicity.
  get url_hit_counts() {
    return this.#url_hits
  }

  // Note: to avoid reference leaking, could return a clone here. Omitted for simplicity.
  get ip_address_hits() {
    return this.#ip_address_hits
  }

  // Note: to avoid reference leaking, could return a clone here. Omitted for simplicity.
  get errors() {
    return this.#errors
  }
}

module.exports = {
  mkStreamFromArray,
  mkStreamFromFile,
  LogReporter,
}
