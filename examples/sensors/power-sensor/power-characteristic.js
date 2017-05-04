var util = require('util');
var moment = require('moment');
var jsonfile = require('jsonfile');
var bleno = require('../../..');
var SensorCharacteristic = require('../sensor-characteristic.js');
var timeStamp = moment().valueOf();
var powerFile = "/tmp/powerSensorData-" + timeStamp + ".json"
var speedFile = "/tmp/powerSpeedSensorData-" + timeStamp + ".json"
var cadenceFile = "/tmp/powerCadenceSensorData-" + timeStamp + ".json"
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
        writeFeatureFlags(data, this.flags);
        writePowerData(data);
        cumulativeRevs = Math.floor(Math.random() * 10) + cumulativeRevs
        var offset = 4
        if (this.flags.indexOf("speed") > -1) {
            var speedTime = startTime * 2048.0;
            writeSpeedData(data, cumulativeRevs, speedTime, offset);
            offset += 6
        }
        if (this.flags.indexOf("cadence") > -1) {
            var cadenceTime = startTime * 1024.0;
            writeCadenceData(data, cumulativeRevs, cadenceTime, offset);
        }
        this._updateValueCallback(data);
        startTime += 1;
        if (startTime > 31) {
            startTime = 1;
        }
    }
};

function writeFeatureFlags(data, flags) {
    var featureFlags = 0x00;
    if (flags.indexOf("speed") > -1) {
        featureFlags = featureFlags | 1 << 4
    }
    if (flags.indexOf("cadence") > -1) {
        featureFlags = featureFlags | 1 << 5
    }
    data.writeIntLE(featureFlags, 0)
}

function writePowerData(data) {
    var simulatedPower = Math.floor(Math.random() * (200 - 50)) + 50
    data.writeInt16LE(simulatedPower, 2);
    var timestamp = moment().valueOf();
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
}

function writeSpeedData(data, cumulativeRevs, eventTime, offset) {
    var timestamp = moment().valueOf();
    data.writeUInt32LE(cumulativeRevs, offset);
    data.writeUInt16LE(eventTime, offset + 4);
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

function writeCadenceData(data, cumulativeRevs, eventTime, offset) {
    var timestamp = moment().valueOf();
    data.writeUInt16LE(cumulativeRevs, offset);
    data.writeUInt16LE(eventTime, offset + 2);
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