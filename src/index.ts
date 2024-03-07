// @ts-ignore
import type { Service, ActivityManager, Message, Subscription, Method } from '@types/webos-service';
import EventEmitter from 'events';

class WebOSService extends EventEmitter {
    #ServiceHandle: Service;

    constructor(ServiceImpl: typeof Service, serviceName: string, activityManager?: ActivityManager, options?: Service.ServiceOptions) {
        super();
        const service: Service = new ServiceImpl(serviceName, activityManager, options);
        service.register(serviceName, (message: Message) => {
            console.log('service request', message);
            message.respond({ returnValue: true });
        });
        this.#ServiceHandle = service;
        return this;
    }

    call(uri: string, args: Record<string, unknown>): Promise<Service.Message> {
        const callbackPromise = new Promise((resolve, reject) => {
            this.#ServiceHandle.call(uri, args, (message: Message) => {
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
    register(name: string, description: string): Method { // TODO: is 'string' accurate here?
        const requestCallback = (message: Message) => {
            this.emit('request', message);
        }
        const cancelCallback = (message: Message) => {
            this.emit('cancel', message);
        }
        return this.#ServiceHandle.register(name, requestCallback, cancelCallback, description);
    }

    // subscriptions to a service are basically an eventemitter that emits 'response' and 'cancel' events.
    // make sure if you receive a cancel message, that you clean up appropriately, and don't leak memory.
    subscribe(uri: string, args: Record<string, unknown>): Subscription {
        return this.#ServiceHandle.subscribe(uri, args);
    }
}

export default WebOSService;
