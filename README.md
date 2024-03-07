webos-service-promised
----------------------
Specifically for use with LG webOS, LuneOS, and other derviative systems.

Probably requires a modern system that can use Node 20+.  Feel free to submit patches if you want to
support earlier versions.  LG webOS systems exist that go waaaaaaaay back into the Node 0.14 or so days.

I intend to use this library with webOS OpenSourceEdition and/or LuneOS systems.  If you do have changes,
please feel free to pull request.

Installation
------------
```
npm install --save webos-service-promised
```

Usage
-----

Registering a service function
------------------------------
```javascript
import WebOSService from "webos-service-promised";
import Service from "webos-service"; // or you may use https://github.com/ericblade/webos-service-stub.git

const service = new WebOSService(Service, 'com.webos.service.test');
service.register('/test', 'Test Service Function');
service.on('request', (message) => {
    console.log('request', message);
    if (message.payload && message.payload.subscribe) {
        // keep track of the message so you can reply to it later
        ...
        message.respond({ subscribed: true, returnValue: true });
    } else if (/* error condition */) {
        message.respond({ errorCode: -123, returnValue: false });
        message.cancel();
    } else {
        message.respond({ returnValue: true });
    }
});
```

Outbound service call (1-shot)
------------------------------
```javascript
import WebOSService from import WebOSService from "webos-service-promised";
import Service from "webos-service"; // or you may use https://github.com/ericblade/webos-service-stub.git

const service = new WebOSService(Service, 'com.webos.service.test');
const serviceCallPromise = await service.call('luna://com.palm.db/get', { dbCallParams });
```

Outbound service subscription
-----------------------------
```javascript
import WebOSService from "webos-service-promised";
import Service from "webos-service"; // or you may use https://github.com/ericblade/webos-service-stub.git

const service = new WebOSService(Service, 'com.webos.service.test');
const subscription = service.subscribe('luna://com.webos.service.subscriptionthing/getSubscription', { subscribe: true });
subscription.on('response', (message) => { /* received subscription message */ });
subscription.on('cancel', (message) => { /* received cancellation, either renew subscription, or go away for now */ });
```

