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
5. Though the dataset was small, I wanted to experiment with building the log reporter in such a way that it could handle streaming a large log file, and supporting the ability to access reporting at any time (ie. not only at the end of the stream). I quite liked the idea of using the Node's event system for this.
