/// <reference types="node" resolution-mode="require"/>
import type { Service, ActivityManager, Subscription, Method } from '@types/webos-service';
import EventEmitter from 'events';
declare class WebOSService extends EventEmitter {
    #private;
    constructor(ServiceImpl: typeof Service, serviceName: string, activityManager: ActivityManager, options: Service.ServiceOptions);
    call(uri: string, args: Record<string, unknown>): Promise<Service.Message>;
    register(name: string, description: string): Method;
    subscribe(uri: string, args: Record<string, unknown>): Subscription;
}
export default WebOSService;
