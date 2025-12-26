// Common operations all repositories need
export interface IBaseRepository<T> {
	generateId(): string;
	save(entity: T): Promise<void | T>;
	findById(id: string): Promise<T | null>;
	findAll(): Promise<T[]>;
	delete(id: string): Promise<void>;
	exists(id: string): Promise<boolean>;
}
