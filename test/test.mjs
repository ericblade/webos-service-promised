import WebOSService from '../dist/index.js';
import Service from 'webos-service-stub';

const service = new WebOSService(Service, 'com.webos.service.test');
service.register('/test', 'Test Service');
console.warn('* service=', service);
service.on('request', (message) => {
    console.log('request', message);
    message.respond({ returnValue: true });
});
service.on('cancel', (message) => {
    console.log('cancel', message);
});

const subscription = service.subscribe('luna://com.webos.service.test/test', { subscribe: true });
console.warn('* subscription=', subscription);

service.call('luna://com.webos.service.test/test', { subscribe: false, test: true });
subscription.cancel();
