import Dexie, { type Table } from 'dexie';

export interface ImageCache {
  id?: number;
  srcUrl: string;
  contentType: string;
  blb: ArrayBuffer;
}

export class LocalDbDexie extends Dexie {
  imageCache!: Table<ImageCache>;
  constructor() {
    super('imageCacheDatabase');
    this.version(1).stores({
        imageCache: '++id, srcUrl, blb, contentType' // Primary key and indexed props
    });
  }
}

export const db = new LocalDbDexie();
