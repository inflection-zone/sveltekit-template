export type PrimitiveType = string | number | boolean | null;

export type ObjectType = Record<string, PrimitiveType | ArrayType | File>;

export type ArrayType = (PrimitiveType | ObjectType | ArrayType | File)[];

export type FormDataType = {
    id: string; // Ensure every form data entry has an ID
    name: string;
    data: ObjectType;
    createdAt: string;
    updatedAt?: string;
    metadata?: Record<string, string | number | boolean>;
};

export type StoredDataType = PrimitiveType | ObjectType | ArrayType | FormDataType;

// IndexedDB requires an object with an `id` field
export type IndexedDBData = { id: string } & (ObjectType | FormDataType);
