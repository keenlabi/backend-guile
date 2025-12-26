import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseRepository<TDomain, TModel extends ObjectLiteral> {
	constructor(protected readonly repository: Repository<TModel>) {}

	generateId(): string {
		const id: string = uuidv4();
		return id;
	}

	async save(entity: TDomain): Promise<void | TDomain> {
		const model = this.toPersistence(entity);
		await this.repository.save(model);
	}

	async findById(id: string): Promise<TDomain | null> {
		const model = await this.repository.findOne({
			where: { id } as unknown as FindOptionsWhere<TModel>,
		});

		if (!model) return null;

		return this.toDomain(model);
	}

	async findAll(): Promise<TDomain[]> {
		const models = await this.repository.find();
		return models.map((model) => this.toDomain(model));
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}

	async exists(id: string): Promise<boolean> {
		const count = await this.repository.count({
			where: { id } as unknown as FindOptionsWhere<TModel>,
		});
		return count > 0;
	}

	// Abstract methods that each domain repository must implement
	protected abstract toDomain(model: TModel): TDomain;
	protected abstract toPersistence(entity: TDomain): TModel;
}
