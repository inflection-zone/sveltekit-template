import { type Session } from "./session";

export interface ISessionCache {
    set(key: string, value: Session): Promise<void>;
    get(key: string): Promise<Session | undefined>;
    has(key: string): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    clear(): Promise<void>;
    size(): Promise<number>;
}
