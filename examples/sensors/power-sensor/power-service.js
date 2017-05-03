var util = require('util');
var bleno = require('../../..');

var PowerMeasurementCharacteristic = require('./power-characteristic.js')
var PowerFeatureCharacteristic = require('./power-feature-characteristic.js')

function PowerSensorService(args) {
    var flags = (args && args != true) ? args.split(",") : [];
    console.log("Starting PowerSensor Simulator with power, " + args)
    bleno.PrimaryService.call(this, {
        uuid: '1818',
        characteristics: [
            new PowerMeasurementCharacteristic(flags),
            new PowerFeatureCharacteristic(flags)
        ]
    });
}

util.inherits(PowerSensorService, bleno.PrimaryService);

module.exports = PowerSensorService;