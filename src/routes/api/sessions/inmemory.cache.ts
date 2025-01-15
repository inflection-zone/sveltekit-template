import type { Session } from "./session";
import { type ISessionCache } from "./session.cache.interface";

////////////////////////////////////////////////////////////////////////////////////////

export class CacheMap<K, V> {

    private cache: Map<K, V>;

    constructor() {
        this.cache = new Map<K, V>();
    }

    // Method to set a value in the cache
    set(key: K, value: V): void {
        this.cache.set(key, value);
    }

    // Method to get a value from the cache
    get(key: K): V | undefined {
        console.log(`size: ${this.cache.size}`);
        return this.cache.get(key);
    }

    // Method to check if a key exists in the cache
    has(key: K): boolean {
        return this.cache.has(key);
    }

    // Method to delete a key from the cache
    delete(key: K): boolean {
        return this.cache.delete(key);
    }

    // Method to clear the entire cache
    clear(): void {
        this.cache.clear();
    }

    // Method to get the size of the cache
    size(): number {
        return this.cache.size;
    }
}

////////////////////////////////////////////////////////////////////////////////////////

export class InMemoryCache implements ISessionCache {

    private cache: CacheMap<string, Session> = new CacheMap<string, Session>();

    constructor() {
        this.cache = new CacheMap<string, Session>();
    }

    set = async (key: string, value: Session): Promise<void> => {
        this.cache.set(key, value);
    };

    get = async (key: string): Promise<Session | undefined> => {
        return this.cache.get(key);
    };

    has = async (key: string): Promise<boolean> => {
        return this.cache.has(key);
    };

    delete = async (key: string): Promise<boolean> => {
        return this.cache.delete(key);
    };

    clear = async (): Promise<void> => {
        this.cache.clear();
    };

    size = async (): Promise<number> => {
        return this.cache.size();
    };
    
}

