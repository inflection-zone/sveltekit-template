import { BACKEND_API_URL } from "$env/static/private";
import { CacheService } from "$lib/server/cache/cache.service";
import { get_ } from "./common";

export const getUserRoles = async () => {
	const url = BACKEND_API_URL + '/types/person-roles';
    const cacheKey = `req-getUserRoles`;
    if (await CacheService.has(cacheKey)) {
        return await CacheService.get(cacheKey);
    }
    const result = await get_(url, false);
    const userRoles = result.Data.PersonRoleTypes;
    await CacheService.set(cacheKey, userRoles);
	return userRoles;
};
export function findIdByRoleName(roles: Role[], roleName: string): number {
    const role = roles.find((r) => r.RoleName === roleName);
    if (!role) {
        throw new Error(`Role with name "${roleName}" not found.`);
    }
    return role.id;
}
type Role =  {
    id: number;
    RoleName: string;
}