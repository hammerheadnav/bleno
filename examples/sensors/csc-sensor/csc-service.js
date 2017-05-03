var util = require('util');
var bleno = require('../../..');

var CSCMeasurementCharacteristic = require('./csc-characteristic.js')
var CSCFeatureCharacteristic = require('./csc-feature-characteristic.js')

function CSCSensorService(args) {
    var flags = (args && args != true) ? args.split(",") : [];
    console.log("Starting CSC Sensor Simulator with " + args)
    bleno.PrimaryService.call(this, {
        uuid: '1816',
        characteristics: [
            new CSCMeasurementCharacteristic(flags),
            new CSCFeatureCharacteristic(flags)
        ]
    });
}

util.inherits(CSCSensorService, bleno.PrimaryService);

module.exports = CSCSensorService;