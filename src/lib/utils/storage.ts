import { browser } from '$app/environment';
import { IndexedDB } from './indexedDB';
import type { StoredDataType, IndexedDBData, ObjectType } from './storageTypes';

export class StorageManager {
    private storageType: 'session' | 'local' | 'indexedDB';
    private indexedDB?: IndexedDB<IndexedDBData>; 

    constructor(type: 'session' | 'local' | 'indexedDB', dbName?: string, storeName?: string) {
        this.storageType = type;

        if (type === 'indexedDB' && browser && dbName && storeName) {
            this.indexedDB = new IndexedDB(dbName, storeName);
        }
    }

    async set(key: string, value:StoredDataType) {
        console.log("in the storage manager", value);
        if (!browser) return;

        if (this.storageType === 'session') {
            sessionStorage.setItem(key, JSON.stringify(value));
        } else if (this.storageType === 'local') {
            localStorage.setItem(key, JSON.stringify(value));
        } else if (this.storageType === 'indexedDB' && this.indexedDB) {
            if (typeof value !== 'object' || value === null) {
                console.error('IndexedDB can only store objects with an `id` field.');
                return;
            }

            console.log(`Adding to IndexedDB: ${JSON.stringify(value)}`);
            const indexedDBValue: IndexedDBData = { id: key, ...(value as ObjectType) };
            await this.indexedDB.add(indexedDBValue);
        }
    }

    async get<T extends StoredDataType>(key: string): Promise<T | null> {
        if (!browser) return null;

        if (this.storageType === 'session') {
            const data = sessionStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } else if (this.storageType === 'local') {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } else if (this.storageType === 'indexedDB' && this.indexedDB) {
            const items = await this.indexedDB.getAll();
            return (items.find((item) => item.id === key) || null) as T | null;
        }

        return null;
    }

    async remove(key: string) {
        if (!browser) return;

        if (this.storageType === 'session') {
            sessionStorage.removeItem(key);
        } else if (this.storageType === 'local') {
            localStorage.removeItem(key);
        } else if (this.storageType === 'indexedDB' && this.indexedDB) {
            await this.indexedDB.delete(key);
        }
    }

    async clear() {
        if (!browser) return;

        if (this.storageType === 'session') {
            sessionStorage.clear();
        } else if (this.storageType === 'local') {
            localStorage.clear();
        } else if (this.storageType === 'indexedDB' && this.indexedDB) {
            await this.indexedDB.clear();
        }
    }
}
