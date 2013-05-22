module.exports = function(opt) {
    return new Bnch(opt);
};

function Bnch(opt) {
    this.opt = opt || {};
    this.opt.samples = this.opt.samples || 1000;
    this.opt.beforeEach = function(){};
    this.cases = [];
    var _this = this;
    process.nextTick(function() {
        _this._run();
    });
}

Bnch.prototype.beforeEach = function(cb) {
    this.opt.beforeEach = cb;
};

Bnch.prototype.add = function(name, cb) {
    this.cases.push({
        name: name,
        cb: cb,
        hrtime: [0,0],
        time: 0
    });
};
Bnch.prototype._run = function() {
    var cases = this.cases;

    if (cases.length < 1) throw new Error("No cases added");

    for (var i = 0; i < cases.length; i++) {
        console.log("Running " + cases[i].name);
        for (var j = 0; j < this.opt.samples; j++) {
            runCase(cases[i], this.opt.beforeEach());
        }
        cases[i].time = hrtime2seconds(cases[i].hrtime);
    }
    this._printResults();
};

Bnch.prototype._printResults = function() {
    var fastestCase = this._getFastestCase(),
        cases = this.cases;

    var colorFastest  = '\u001b[32m', // green
        colorReset = '\u001b[0m';
    console.log("==================================================================");
    for (var i = 0; i < cases.length; i++) {
        var c = cases[i];
        var timePerOperation = c.time / this.opt.samples;
        var opsPerSecond = 1 / timePerOperation;
        var str = c.name + ": " + opsPerSecond.toFixed(2) + " ops per second. -- ";
        if (c === fastestCase) {
            str = colorFastest + str;
            str += "Fastest" + colorReset;
        } else {
            var timesSlower = 1 - (fastestCase.time / c.time);
            str += (timesSlower * 100).toFixed(2) + "% slower";
        }
        console.log(str);
    }
    console.log("==================================================================");
};

Bnch.prototype._getFastestCase = function() {
    var cases = this.cases;
    var fastestCase = cases[0];
    for (var i = 0, l = cases.length; i < l; i++) {
        if (cases[i].time < fastestCase.time) {
            fastestCase = cases[i];
        }
    }
    return fastestCase;
};


function runCase(caseObj, prepData) {
    var time = process.hrtime();
    caseObj.cb(prepData);
    time = process.hrtime(time);
    hrtimeAdd(caseObj.hrtime, time);
}

function hrtimeAdd(aggregate, hrtime) {
    aggregate[0] += hrtime[0];
    aggregate[1] += hrtime[1];
}

function hrtime2seconds(hrtime) {
    return hrtime[0] + (hrtime[1] / 1e9);
}



