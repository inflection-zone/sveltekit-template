import type { Session } from './session';
import { CACHE_TYPE } from '$env/static/private';
import { InMemoryCache } from './inmemory.cache'
import { RedisCache } from './redis.cache';
import type { ISessionCache } from './session.cache.interface';
import { building } from '$app/environment';

/////////////////////////////////////////////////////////////////////////////

const getCache = () => {
    //code should not be executed during the build step.
    if (!building) {
        if (CACHE_TYPE === 'in-memory') {
            return new InMemoryCache();
        }
        return new RedisCache();
    }
	return new InMemoryCache(); 
};

/////////////////////////////////////////////////////////////////////////////
export class SessionManager {

  static _sessionCache: ISessionCache = getCache();

	static addSession = async (sessionId: string, session: Session): Promise<Session | null | undefined> => {
    if (!session?.sessionId) {
			return null;
		}
		console.log(`Adding session: ${JSON.stringify(session)}`);

    const existingSession = await SessionManager._sessionCache.has(sessionId);

    if (existingSession) {
			// Remove existing
			await await SessionManager._sessionCache.delete(sessionId);
		}

    await SessionManager._sessionCache.set(sessionId, session);
    
    return Promise.resolve(session);
	};

	static getSession = async (sessionId: string): Promise<Session | null | undefined> => {
		const session = await SessionManager._sessionCache.get(sessionId);
    if (!session) return Promise.resolve(null);
    console.log(`Retrieving existing session: ${session}`);
		return Promise.resolve(session);
	};

	static isValid = async (sessionId: string): Promise<boolean> => {
		console.log(`Checking session validity!`);
		const session = await SessionManager._sessionCache.get(sessionId);
		if (!session) {
			return Promise.resolve(false);
		}
		
		if (session.expiryDate && session.expiryDate < new Date()) {
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	};

	static removeSession = async (sessionId: string): Promise<Session | null> => {
		const session = await SessionManager._sessionCache.get(sessionId);
     	console.log(`Removing session: ${session}`);
		if (!session) {
			return Promise.resolve(null);
		}
		const _sessions = await SessionManager._sessionCache.delete(sessionId);
		console.log(`Removing session: ${typeof _sessions}`);
		return Promise.resolve(session);
	};

	static constructSession = async (user, accessToken: string, expiryDate: Date, refreshToken?: string): Promise<Session | null | undefined> => {
		console.log(`Constructing session!`);
		console.log(`User: ${JSON.stringify(user, null, 2)}`);
		// console.log(`Token: ${token}`);
		// console.log(`Expiry date: ${expiryDate.toISOString()}`);

		if (!user || !accessToken || !expiryDate) {
			return null;
		}
		const session: Session = {
			sessionId      : user.SessionId,
			tenantId       : user.TenantId,
            tenantCode     : user.TenantCode,
			tenantName     : user.TenantName,
			accessToken    : accessToken,
			refreshToken   : refreshToken,
			userId         : user.id,
			email          : user.Person.Email,
			username       : user.UserName,
			profileImageUrl: user.Person.ProfileImageURL ?? null,
			fullName       : user.Person.DisplayName ?? null,
			firstName      : user.Person.FirstName ?? null,
			roleId         : user.Role.id,
			roleName       : user.Role.RoleName,
			expiryDate     : expiryDate,
		};
        console.log(`Session: ${JSON.stringify(session, null, 2)}`);

		return Promise.resolve(session);
	};
}
