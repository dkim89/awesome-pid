# awesome-pid
A PID controller with built-in looping functionality.

## Installation
`$ npm install awesome-pid`

## Creating awesome-pid object with options
```javascript
var PID = require('awesome-pid');
var options = {
  kp: 0.5,
  ki: 0.05,
  kd: 0.1,
  dt: 300,  // milliseconds
  initial: 0,
  target: 100,
  u_bound: 30,
  l_bound: -30
}

var testPID = new PID(options);
```

## Parameters
### Options
Property | Type | Description | Default
-------- | ---- | ----------- | -------
kp | Number | Proportional gain | 0
ki | Number | Integral gain | 0
kd | Number | Derivative gain | 0
dt | Number | Time interval in milliseconds | 1000
initial | Number | Initial input value | 0
target | Number | Target value | 0
u_bound | Number | Output upper bound |
l_bound | Number | Output lower bound |

## Functions and Accessors
Option parameters can be used (above), or each value can be set individually.
```javascript
var PID = require('awesome-pid');

var testPID = new PID();

// Set kp, ki, kd values respectively
testPID.setTuning(0.5, 0.05, 0.1);
console.log('kp: ' + testPID.kp + ' | ki: ' + testPID.ki + ' | kd: ' + testPID.kd);
// => kp: 0.5 | ki: 0.05 | kd: 0.1

// Set time interval (dt) in ms
testPID.setTimeInterval(300);
console.log('dt: ' + testPID.dt);
// => dt: 300

// Set input value
testPID.setInput(10);
console.log('Input: ' + testPID.input);
// => Input: 10

// Set target value
testPID.setTarget(100);
console.log('Target: ' + testPID.target);
// => Target: 100

// Set upper bound of output
testPID.setUBound(20);
// Set lower bound of output
testPID.setLBound(-20);
console.log('ubound: ' + testPID.u_bound + ' | lbound: ' + testPID.l_bound);
// => ubound: 20 | lbound: -20

// Reset PID
testPID.reset();
```

## Example
```javascript
var PID = require('awesome-pid');
var currentValue = 0;
var targetValue = 100;

var options = {
  kp: 0.5,
  ki: 0.05,
  kd: 0.1,
  dt: 300,  // milliseconds
  initial: currentValue,
  target: targetValue,
  u_bound: 30,
  l_bound: -30
}

var testPID = new PID(options);

console.log('Starting loop...');
testPID.startLoop();

// Will be emitted every dt milliseconds
testPID.on("output", function(output) {
  currentValue += output;
  var val = parseInt(currentValue);
  console.log('Output: '  + parseFloat(output).toFixed(2) + ' | Value: ' + parseFloat(currentValue).toFixed(2));
  this.setInput(currentValue);

  // Stop and exit function once integer value of current value is equal to target value.
  if (val === targetValue ) {
    this.stopLoop();
    console.log('Current value equal to target value.  Stop loop and exit program.');
  }
});
```
