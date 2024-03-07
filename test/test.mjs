import WebOSService from '../dist/index.js';
import Service from 'webos-service-stub';

const service = new WebOSService(Service, 'com.webos.service.test');
service.register('/test', 'Test Service');

service.on('request', (message) => {
    console.log('request', message);
    message.respond({ returnValue: true });
});

service.on('cancel', (message) => {
    console.log('cancel', message);
});

const subscription = service.subscribe('luna://com.webos.service.test/test', { subscribe: true });

service.call('luna://com.webos.service.test/test', { subscribe: false, test: true });

subscription.cancel();
