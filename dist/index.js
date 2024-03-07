var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WebOSService_ServiceHandle;
import EventEmitter from 'events';
class WebOSService extends EventEmitter {
    constructor(ServiceImpl, serviceName, activityManager, options) {
        super();
        _WebOSService_ServiceHandle.set(this, void 0);
        const service = new ServiceImpl(serviceName, activityManager, options);
        service.register(serviceName, (message) => {
            console.log('service request', message);
            message.respond({ returnValue: true });
        });
        __classPrivateFieldSet(this, _WebOSService_ServiceHandle, service, "f");
        return this;
    }
    call(uri, args) {
        const callbackPromise = new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _WebOSService_ServiceHandle, "f").call(uri, args, (message) => {
                // TODO: handle error cases, and reject
                resolve(message);
            });
        });
        return callbackPromise;
    }
    // to respond to a message, use message.respond(...), to cancel/on error, use message.cancel(...)
    // if someone requests a subscription ({ subscribe: true }) *AND* you want to support subscriptions,
    // make sure you respond ({ subscribed: true }) to the message, and keep a copy of the request, so
    // you can use it to respond() or cancel() in the future.
    // to listen to the incoming messages, use this.on('request', (message: Message) => { ... })
    // likewise for cancel.  If you accept subscriptions, make sure when you receive a cancel, that you
    // clear out your reference to the original subscribing message, so you don't try to talk to it again,
    // and that you don't leak memory.
    register(name, description) {
        const requestCallback = (message) => {
            this.emit('request', message);
        };
        const cancelCallback = (message) => {
            this.emit('cancel', message);
        };
        return __classPrivateFieldGet(this, _WebOSService_ServiceHandle, "f").register(name, requestCallback, cancelCallback, description);
    }
    // subscriptions to a service are basically an eventemitter that emits 'response' and 'cancel' events.
    // make sure if you receive a cancel message, that you clean up appropriately, and don't leak memory.
    subscribe(uri, args) {
        return __classPrivateFieldGet(this, _WebOSService_ServiceHandle, "f").subscribe(uri, args);
    }
}
_WebOSService_ServiceHandle = new WeakMap();
export default WebOSService;
