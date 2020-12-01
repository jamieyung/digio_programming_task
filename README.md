## Install/run instructions

### Running the program
```bash
make
```

### Running the tests
```bash
make install
make test
```

## Considerations

1. The task seemed like fairly straightforward data processing on a small data set; the choice of language probably wouldn't matter so much (eg. with respect to efficiency/tractability). In particular, multi-threading didn't seem necessary.
2. To date, the most enjoyable dev experience I've had while writing data processing programs has been in the purely functional paradigm (Haskell/Elm/Purescript) due to the immutability guarantees, concise and elegant expressivity, and robust compiler assistance. For a larger project, I would more seriously consider using a pure FP language; however, due to the modest size of this task, it didn't seem worthwhile to forgo familiarity for the reader (FP languages are fairly esoteric) and simplicity.
3. I wanted to minimise friction for whoever was going to run the programs/tests, so the suggested languages that didn't require compilation (Python/JS) went on my short-list.
4. Of the suggested languages, JS was most fresh in my memory as it was the one I'd used most recently.
5. Though the dataset was small, I wanted to experiment with building the log reporter in such a way that it could handle streaming a large log file without using a lot of memory, and supporting the ability to access reporting at any time (ie. not only at the end of the stream). I quite liked the idea of using the Node's event system for this.

## Observations

After implementing the logic to process the lines, I implemented the stats logic and noticed a few things about the data set by looking at the reporting (and also looking at the raw data set).

1. There was not a unique top 3 in either of most visited URLs (hit counts: 2,2, then a bunch of 1s) or most active IP addresses (request counts: 4 then a bunch of 3s). For the sake of simplicity (and also because sort-order wasn't specified and because an obvious default wasn't clear), I decided to leave the sort-order as indeterminate (in my implementation, just the sort order imposed by JS map keys).
2. I noticed a couple of the urls included the protocol and website as a prefix, and furthermore that by ignoring them, the /faq/ url was actually visited twice. I then decided to ignore the protocol and website part of the url, bumping /faq/ into the top 3. This may or may not be appropriate (wasn't specified in the spec).

## Notes

1. The bulk of the logic is in `src/log_reporter.js`. I tried to keep the `LogReporter` class fairly generic (I kept the task-specific reporting logic in a separate function). I made the `LogReporter` class expect a `Readable`-like object (emits the following events: `data` with a log line, `end` for end of stream, and `error`), and provided two helper functions (`mkStreamFromFile` and `mkStreamFromArray`) to create them. This abstraction allowed the `LogReporter` class to work with Arrays and file streams uniformly, which was convenient for testing.
