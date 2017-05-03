var util = require('util');
var moment = require('moment');
var jsonfile = require('jsonfile');
var bleno = require('../../..');
var SensorCharacteristic = require('../sensor-characteristic.js');

var file = "/tmp/hrSensorData-" + moment().unix() + ".json"

var HeartRateMeasurementCharacteristic = function() {
    HeartRateMeasurementCharacteristic.super_.call(this, {
        uuid: '2A37',
        properties: ['notify'],
        value: null
    });
};

util.inherits(HeartRateMeasurementCharacteristic, SensorCharacteristic);

HeartRateMeasurementCharacteristic.prototype.valueGenerator = function() {
    if (this._updateValueCallback != null) {
        var data = new Buffer(2);
        data[0] = 0x00;
        var simulatedHR = Math.floor(Math.random() * (200 - 50)) + 50;
        data.writeUInt8(simulatedHR, 1);
        var timestamp = moment().unix();
        this._updateValueCallback(data);
        var hrObj = {
            value: simulatedHR,
            timestamp: timestamp
        }
        jsonfile.writeFile(file, hrObj, {
            flag: 'a'
        }, function(err) {
            if (err != null) {
                console.error(err)
            }
        })
    }
}

module.exports = HeartRateMeasurementCharacteristic;