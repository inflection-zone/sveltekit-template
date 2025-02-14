import { browser } from '$app/environment';

export class IndexedDB<T extends { id: string }> {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null = null;

    constructor(dbName: string, storeName: string) {
        if (!browser) return;
        this.dbName = dbName;
        this.storeName = storeName;
        this.initDB();
    }

    private initDB() {
        if (!browser) return;
        const request = indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => {
            this.db = request.result;
        };

        request.onerror = () => {
            console.error('IndexedDB initialization failed');
        };
    }

    async add(item: T): Promise<void> {
        console.log('Adding item to IndexedDB:', item);
        if (!browser || !this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(): Promise<T[]> {
        if (!browser || !this.db) return Promise.resolve([]);

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(id: string): Promise<void> {
        if (!browser || !this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clear(): Promise<void> {
        if (!browser || !this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
