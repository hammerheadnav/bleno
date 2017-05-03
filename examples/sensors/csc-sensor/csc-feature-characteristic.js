var util = require('util');
var moment = require('moment');
var jsonfile = require('jsonfile');
var bleno = require('../../..');
var SensorCharacteristic = require('../sensor-characteristic.js');

var CSCFeatureCharacteristic = function(flags) {
    CSCFeatureCharacteristic.super_.call(this, {
        uuid: '2A5C',
        properties: ['read'],
        value: null
    });
    this.flags = flags
};

util.inherits(CSCFeatureCharacteristic, SensorCharacteristic);

CSCFeatureCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log("onReadRequest")
    var features = 0x00;
    if (this.flags.indexOf("speed") > -1) {
        features = features | 1 << 0;
    }
    if (this.flags.indexOf("cadence") > -1) {
        features = features | 1 << 1;
    }
    var data = Buffer([features])
    callback(this.RESULT_SUCCESS, data);
}

module.exports = CSCFeatureCharacteristic;