var util = require('util');
var bleno = require('../../..');

var HeartRateMeasurementCharacteristic = require('./heartrate-characteristic.js')

function HeartRateSensorService() {
    bleno.PrimaryService.call(this, {
        uuid: '180D',
        characteristics: [
            new HeartRateMeasurementCharacteristic()
        ]
    });
}

util.inherits(HeartRateSensorService, bleno.PrimaryService);

module.exports = HeartRateSensorService;