var util = require('util');
var moment = require('moment');
var bleno = require('../..');

var BlenoCharacteristic = bleno.Characteristic;

function SensorMeasurementCharacteristic(options) {
  SensorMeasurementCharacteristic.super_.call(this, options);
  this._updateValueCallback = null;
  this.timer = null
};

util.inherits(SensorMeasurementCharacteristic, BlenoCharacteristic);

SensorMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('SensorMeasurementCharacteristic - onSubscribe');
  this._updateValueCallback = updateValueCallback;  
  var self = this
  this.timer = setInterval(function() { return self.valueGenerator(); }, 1000)
};

SensorMeasurementCharacteristic.prototype.onUnsubscribe = function() {
  console.log('SensorMeasurementCharacteristic - onUnsubscribe');
  this._updateValueCallback = null;
  clearInterval(this.timer)
};

module.exports = SensorMeasurementCharacteristic;
