var util = require('util');
var moment = require('moment');
var jsonfile = require('jsonfile');
var bleno = require('../../..');
var SensorCharacteristic = require('../sensor-characteristic.js');

var timeStamp = moment().unix().milliseconds();
var speedFile = "/tmp/speedSensorData-" + timeStamp + ".json"
var cadenceFile = "/tmp/cadenceSensorData-" + timeStamp + ".json"
var startTime = 1;
var cumulativeRevs = 1;
var CSCMeasurementCharacteristic = function(flags) {
    CSCMeasurementCharacteristic.super_.call(this, {
        uuid: '2A5B',
        properties: ['notify'],
        value: null
    });
    this.flags = flags;
};

util.inherits(CSCMeasurementCharacteristic, SensorCharacteristic);

CSCMeasurementCharacteristic.prototype.valueGenerator = function() {
    if (this._updateValueCallback != null) {
        var data = new Buffer(30);
        var featuresFlag = 0x00;
        if (this.flags.indexOf("speed") > -1) {
            featuresFlag = featuresFlag | 1 << 0;
        }
        if (this.flags.indexOf("cadence") > -1) {
            featuresFlag = featuresFlag | 1 << 1;
        }
        data.writeIntLE(featuresFlag, 0)
        cumulativeRevs = Math.floor(Math.random() * 10) + cumulativeRevs
        var offset = 1
        if (this.flags.indexOf("speed") > -1) {
            var speedTime = startTime * 1024.0;
            writeSpeedData(data, cumulativeRevs, speedTime, offset);
            offset += 6;
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

function writeSpeedData(data, cumulativeRevs, eventTime, offset) {
    var timestamp = moment().unix().milliseconds();
    data.writeUInt32LE(cumulativeRevs, offset);
    data.writeUInt16LE(eventTime, offset+4);
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
    var timestamp = moment().unix().milliseconds();
    data.writeUInt16LE(cumulativeRevs, offset);
    data.writeUInt16LE(eventTime, offset+2);
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

module.exports = CSCMeasurementCharacteristic;