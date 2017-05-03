var util = require('util');
var bleno = require('../..');
var HearRateService = require('./hr-sensor/heartrate-service');
var PowerService = require('./power-sensor/power-service');
var CSCService = require('./csc-sensor/csc-service');
var name = 'Sensor Simulator';
var argv = require('minimist')(process.argv.slice(2));
var services = [];
if (argv.hasOwnProperty("power")) {
    services.push(new PowerService(argv["power"]));
}
if (argv.hasOwnProperty("heartRate")) {
    services.push(new HearRateService());
}
if(argv.hasOwnProperty("csc")) {
    services.push(new CSCService(argv["csc"]));
}

bleno.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        var uuids = [];
        services.forEach(function(service) {
            uuids.push(service.uuid)
        })
        bleno.startAdvertising(name, uuids, function(err) {
            if (err) {
                console.log(err);
            }
        });
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(err) {
    if (!err) {
        console.log('advertising ' + services.length + ' services...');
        bleno.setServices(services);
    }
});