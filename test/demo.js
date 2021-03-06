/**
 *  demo.js
 *  A demo that will use the loop to set a number from 0 to 100 using PID
 *  gradually
 */
var PID = require('../lib/awesome-pid.js');

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

console.log('kp: ' + testPID.kp + ' | ki: ' + testPID.ki + ' | kd: ' + testPID.kd + ' | dt: ' + testPID.dt);
console.log('input: ' + testPID.input + ' | target: ' + testPID.target);
console.log('ubound: ' + testPID.u_bound + ' | lbound: ' + testPID.l_bound);

console.log('Starting loop...');
testPID.startLoop();
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
