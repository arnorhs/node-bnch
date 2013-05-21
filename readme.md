# bnch

Node.js benchmark in the console

### Installation

    npm install bnch

### Usage:

Create a new file called mybenchmark.js

```javascript
var bnch = require('bnch');

var suite = bnch();

// optional, if you want to specify some preparation before each run
suite.beforeEach(function() {
    // return the value to be used in the benchmark
    return 42;
});

suite.add("equals", function(number) {
    number == 42;
});

suite.add("very equals", function(number) {
    number === 42;
});
```

And run your file using

    node mybenchmark.js

And the output will look like this:

### License

MIT
