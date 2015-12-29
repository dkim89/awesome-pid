var EventEmitter = require('events').EventEmitter;
var util = require('util');
var temporal = require('temporal');

/**
 * AwesomePID
 * @constructor
 *
 * @param {Object} opts Options: kp, ki, pd, dt, initial, target, u_bound, l_bound
 */
var AwesomePID = function(opts) {
  if (opts !== undefined) {
    this.setTuning(opts.kp, opts.ki, opts.kd);
    this.setTimeInterval(opts.dt);
    this.setInput(opts.initial);
    this.setTarget(opts.target);
    this.setUBound(opts.u_bound);
    this.setLBound(opts.l_bound);
  }

  this.reset();

  // Getters & Setters
  Object.defineProperties(this, Object.assign({}, {
    kp: { get: function() { return this.setkp; }},
    ki: { get: function() { return this.setki; }},
    kd: { get: function() { return this.setkd; }},
  }));
};

util.inherits(AwesomePID, EventEmitter);

// If either kp, ki, kd < 0, it is defaulted to 0
AwesomePID.prototype.setTuning = function(kp, ki, kd) {
  this.setkp = (kp === undefined || kp < 0) ? 0 : kp;
  this.setki = (ki === undefined || ki < 0) ? 0 : ki;
  this.setkd = (kd === undefined || kd < 0) ? 0 : kd;

  var sec = this.dt / 1000;
  this.kp = this.setkp;
  this.ki = this.setki * sec;
  this.kd = this.setkd / sec;
};

// Set interval in which PID is computed.  Default is 0.5 second.
AwesomePID.prototype.setTimeInterval = function(ms) {
  this.dt = (ms === undefined || ms < 0) ? 500 : ms;
}

// Set input value
AwesomePID.prototype.setInput = function(input) {
  this.input = input || 0;
};

// Set target value
AwesomePID.prototype.setTarget = function(target) {
  this.target = target || 0;
};

// Set upper bound
AwesomePID.prototype.setUBound = function(ubound) {
  this.u_bound = ubound;
}

// Set lower bound
AwesomePID.prototype.setLBound = function(lbound) {
  this.l_bound = lbound;
}

// Reset values
AwesomePID.prototype.reset = function() {
  this.totalError = 0;
  this.lastInput = this.input;
  this.lastTime = currentTime() - this.dt;
}

// Single instance of computation - based on Arduino PID library.
AwesomePID.prototype.compute = function() {
  var now = currentTime();
  var timeChange = (now - this.lastTime);

  if (timeChange >= this.dt) {
    var input = this.input;
    var error = this.target - input;
    this.totalError += (this.ki * error);
    if (this.u_bound !== undefined && this.totalError > this.u_bound) this.totalError = this.u_bound;
    else if (this.l_bound !== undefined && this.totalError < this.l_bound) this.totalError = this.l_bound;
    var diff = this.input - this.lastInput;

    // PID output computation
    var output = this.kp * error + this.totalError - this.kd * diff;
    if (this.u_bound !== undefined && output > this.u_bound) output = this.u_bound;
    else if (this.l_bound !== undefined && output < this.l_bound) output = this.l_bound;

    this.output = output;
    this.lastInput = input;
    this.lastTime = now;

    // Emit computed output
    this.emit("output", this.output);
  }
};

// Start async looping computation, every dt milliseconds
AwesomePID.prototype.startLoop = function() {
  var me = this;
  this.loop = temporal.loop(this.dt, function() {
    me.compute();
  });
};

// Stop looping computation
AwesomePID.prototype.stopLoop = function() {
  if (this.loop !== undefined) { this.loop.stop(); }
};

function currentTime() {
  var d = new Date();
  return d.getTime();
}

module.exports = AwesomePID;
