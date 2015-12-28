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
  this.setTuning(opts.kp, opts.ki, opts.kd);
  this.setTimeInterval(opts.dt);
  this.setInput(opts.initial);
  this.setTarget(opts.target);
  this.setUBound(opts.u_bound);
  this.setLBound(opts.l_bound);

  this.reset();

  // Getters & Setters
  Object.defineProperties(this, Object.assign({} {
    kp:       { get: function() { return this.setkp; }},
    ki:       { get: function() { return this.setki; }},
    kd:       { get: function() { return this.setkd; }},
    dt:       { get: function() { return this.dt; }},
    target:   { get: function() { return this.target; }},
    u_bound:  { get: function() { return this.u_bound; }},
    l_bound:  { get: function() { return this.l_bound; }},
    input:    { get: function() { return this.input; }}
    output:   { get: function() { return this.output; }}
  }));
};

util.inherits(AwesomePID, EventEmitter);

// If either kp, ki, kd < 0, it is defaulted to 0
AwesomePID.prototype.setTuning = function(kp, ki, kd) {
  var tkp = kp || 0;
  var tki = ki || 0;
  var tkd = kd || 0;
  this.setkp = (tkp < 0) ? 0 : tkp;
  this.setki = (tki < 0) ? 0 : tki;
  this.setkd = (tkd < 0) ? 0 : tkd;

  var sec = this.dt / 1000;
  this.kp = this.setkp;
  this.ki = this.setki * sec;
  this.kd = this.setkd / sec;
};

// Set interval in which PID is computed.  Default is 0.5 second.
AwesomePID.prototype.setTimeInterval = function(ms) {
  var dt = ms || 500;
  this.dt = (dt < 0) ? 500 : dt;
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
  this.u_bound = ubound || 0;
}

// Set lower bound
AwesomePID.prototype.setLBound = function(lbound) {
  this.l_bound = lbound || 0;
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
    if (this.totalError > this.u_bound) this.totalError = this.u_bound;
    else if (this.totalError < this.l_bound) this.totalError = this.l_bound;
    var diff = this.input - this.lastInput;

    // PID output computation
    var output = this.kp * error + this.totalError - this.kd * diff;
    if (output > this.u_bound) output = this.u_bound;
    else if (output < this.l_bound) output = this.l_bound;

    this.output = output;
    this.lastInput = input;
    this.lastTime = now;

    // Emit computed output
    this.emit("output", this.output);
  }
};

// Start async looping computation, every dt milliseconds
AwesomePID.prototype.startLoop = function() {
  this.loop = temporal.loop(this.dt, function() {
    this.compute();
    this.setInput(this.output);
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
