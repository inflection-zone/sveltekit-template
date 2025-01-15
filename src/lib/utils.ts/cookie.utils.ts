import type { RequestEvent } from '@sveltejs/kit';
import { Helper } from './helper';

export class CookieUtils {

    static setCookieHeader = (
        event: RequestEvent,
        name: string,
        value: string,
        hours: number = 24 * 7) => {
        event.cookies.set(name, value, {
            maxAge: hours * 3600,
            expires: Helper.addHours(hours),
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            path: '/'
        });
    }

    static removeCookieHeader = (event: RequestEvent, name: string) => {
        event.cookies.set(name, '', {
            expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            path: '/'
        });
    }


}
