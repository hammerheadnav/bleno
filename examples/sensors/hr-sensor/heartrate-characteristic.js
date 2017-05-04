var util = require('util');
var moment = require('moment');
var csv = require('fast-csv');
var bleno = require('../../..');
var fs = require('fs');
var SensorCharacteristic = require('../sensor-characteristic.js');

var file = "/tmp/hrSensorData-" + moment().valueOf() + ".csv"
var csvStream = csv.createWriteStream({
        headers: true
    }),
    writableStream = fs.createWriteStream(file);

csvStream.pipe(writableStream);
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
        var timestamp = moment().valueOf();
        this._updateValueCallback(data);
        var hrObj = {
            value: simulatedHR,
            timestamp: timestamp
        }
        csvStream.write(hrObj)
    }
}

module.exports = HeartRateMeasurementCharacteristic;