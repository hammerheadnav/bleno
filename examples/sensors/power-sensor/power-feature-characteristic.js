var util = require('util');
var moment = require('moment');
var jsonfile = require('jsonfile');
var bleno = require('../../..');
var SensorCharacteristic = require('../sensor-characteristic.js');

var PowerFeatureCharacteristic = function(flags) {
    PowerFeatureCharacteristic.super_.call(this, {
        uuid: '2A65',
        properties: ['read'],
        value: null
    });
    this.flags = flags
};

util.inherits(PowerFeatureCharacteristic, SensorCharacteristic);

PowerFeatureCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log("onReadRequest")
    var features = 0x00;
    if (this.flags.indexOf("speed") > -1) {
        features = features | 1 << 2;
    }
    if (this.flags.indexOf("cadence") > -1) {
        features = features | 1 << 3;
    }
    var data = Buffer([features, 0x00, 0x00, 0x00])
    callback(this.RESULT_SUCCESS, data);
}

module.exports = PowerFeatureCharacteristic;