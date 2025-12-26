import { EntityManager } from 'typeorm';

export interface ITransactionManager {
	withTransaction<T>(
		work: (transactionalEntityManager: EntityManager) => Promise<T>,
	): Promise<T>;
}
