var util = require('util');
var moment = require('moment');
var jsonfile = require('jsonfile');
var bleno = require('../../..');
var SensorCharacteristic = require('../sensor-characteristic.js');

var powerFile = "/tmp/powerSensorData-" + moment().unix() + ".json"
var speedFile = "/tmp/speedSensorData-" + moment().unix() + ".json"
var cadenceFile = "/tmp/cadenceSensorData-" + moment().unix() + ".json"
var startTime = 1;
var cumulativeRevs = 1;
var PowerMeasurementCharacteristic = function(flags) {
    PowerMeasurementCharacteristic.super_.call(this, {
        uuid: '2A63',
        properties: ['notify'],
        value: null
    });
    this.flags = flags;
};

util.inherits(PowerMeasurementCharacteristic, SensorCharacteristic);

PowerMeasurementCharacteristic.prototype.valueGenerator = function() {
    if (this._updateValueCallback != null) {
        var data = new Buffer(30);
        data.writeIntLE(48, 0)
        var simulatedPower = Math.floor(Math.random() * (200 - 50)) + 50
        data.writeInt16LE(simulatedPower, 2);
        cumulativeRevs = Math.floor(Math.random() + 10) + cumulativeRevs
        if (this.flags.indexOf("speed") > -1) {
            var speedTime = startTime * 2048.0;
            writeSpeedData(data, cumulativeRevs, speedTime);
        }
        if (this.flags.indexOf("cadence") > -1) {
            var cadenceTime = startTime * 1024.0;
            writeCadenceData(data, cumulativeRevs, cadenceTime);
        }
        var timestamp = moment().unix();
        this._updateValueCallback(data);
        var powerObj = {
            value: simulatedPower,
            timestamp: timestamp
        }
        jsonfile.writeFile(powerFile, powerObj, {
            flag: 'a'
        }, function(err) {
            if (err != null) {
                console.error(err)
            }
        })
        startTime += 1;
        if (startTime > 31) {
            startTime = 1;
        }
    }
};

function writeSpeedData(data, cumulativeRevs, eventTime) {
    var timestamp = moment().unix();
    data.writeUInt32LE(cumulativeRevs, 4);
    data.writeUInt16LE(eventTime, 8);
    var speedObj = {
        value: {
            cumulativeRevs: cumulativeRevs,
            eventTime: eventTime
        },
        timestamp: timestamp
    };
    jsonfile.writeFile(speedFile, speedObj, {
        flag: 'a'
    }, function(err) {
        if (err != null) {
            console.error(err)
        }
    });
}

function writeCadenceData(data, cumulativeRevs, eventTime) {
    var timestamp = moment().unix();
    data.writeUInt16LE(cumulativeRevs, 10);
    data.writeUInt16LE(eventTime, 12);
    var cadenceObj = {
        value: {
            cumulativeRevs: cumulativeRevs,
            eventTime: eventTime
        },
        timestamp: timestamp
    };
    jsonfile.writeFile(cadenceFile, cadenceObj, {
        flag: 'a'
    }, function(err) {
        if (err != null) {
            console.error(err)
        }
    });
}

module.exports = PowerMeasurementCharacteristic;