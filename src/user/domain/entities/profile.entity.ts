export class Profile {
	public readonly id: string;
	public readonly userId: string;
	public readonly firstName: string;
	public readonly lastName: string;
	public readonly username: string;
	public readonly createdAt?: Date;
	public readonly updatedAt?: Date;

	constructor(
		id: string,
		userId: string,
		firstName: string,
		lastName: string,
		username: string,
		createdAt?: Date,
		updatedAt?: Date,
	) {
		if (!id) throw new Error('Profile id is required');
		if (!userId) throw new Error('userId is required');

		this.id = id;
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	static create(
		id: string,
		userId: string,
		firstName: string,
		lastName: string,
		username: string,
	) {
		return new Profile(
			id,
			userId,
			firstName,
			lastName,
			username,
		);
	}

	static fromPersistence(
		id: string,
		userId: string,
		firstName: string,
		lastName: string,
		username: string,
		createdAt?: Date,
		updatedAt?: Date,
	) {
		return new Profile(
			id,
			userId,
			firstName,
			lastName,
			username,
			createdAt,
			updatedAt,
		);
	}
}
