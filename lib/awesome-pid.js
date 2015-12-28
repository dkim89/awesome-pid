/**
 * AwesomePID
 * @constructor
 *
 * @param {Object} opts Options: kp, ki, pd, dt, initial, target, u_bound, l_bound
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var temporal = require('temporal');

var AwesomePID = function(opts) {
  this.kp       = opts.kp || 0;
  this.ki       = opts.ki || 0;
  this.kd       = opts.kd || 0;
  this.dt       = opts.dt || 500;    // default 0.5 second
  this.input    = opts.initial || 0;
  this.target   = opts.target || 0;
  this.u_bound  = opts.u_bound || 0;
  this.l_bound  = opts.l_bound || 0;

  this.currentValue = 0;
  this.currentError = 0;
  this.lastError    = 0;
  this.elapsedTime  = 0;

  // Getters & Setters
  Object.defineProperties(this, Object.assign({} {
    kp:       { get: function() { return this.kp; }},
    ki:       { get: function() { return this.ki; }},
    kd:       { get: function() { return this.kd; }},
    dt:       { get: function() { return this.dt; }},
    target:   { get: function() { return this.target; }},
    u_bound:  { get: function() { return this.u_bound; }},
    l_bound:  { get: function() { return this.l_bound; }},
    value:    { get: function() { return this.currentValue; }}
  }));
};

util.inherits(AwesomePID, EventEmitter);

// If either kp, ki, kd < 0, it is defaulted to 0
AwesomePID.prototype.setTuningValues = function(kp, ki, kd) {
  (kp < 0) ? this.kp = 0 : this.kp = kp;
  (ki < 0) ? this.ki = 0 : this.ki = ki;
  (kd < 0) ? this.kd = 0 : this.kd = kd;
};

// Set input value
AwesomePID.prototype.setInput = function(input) {
  this.input = input;
};

// Set target value
AwesomePID.prototype.setTarget = function(target) {
  this.target = target;
};

// Single instance of computation
AwesomePID.prototype.compute = function() {
  var dt = this.dt;


  this.emit("value", currentValue);
};

// Set upper bound
AwesomePID.prototype.setUBound = function(ubound) {
  this.u_bound = ubound;
}

// Set lower bound
AwesomePID.prototype.setLBound = function(lbound) {
  this.l_bound = lbound;
}

// Start async looping computation, every dt milliseconds
AwesomePID.prototype.startLoop = function() {
  this.loop = temporal.loop(this.dt, function() {
    this.compute();
  });
};

// Stop looping computation
AwesomePID.prototype.stopLoop = function() {
  if (this.loop !== undefined) { this.loop.stop(); }
};

module.exports = AwesomePID;
