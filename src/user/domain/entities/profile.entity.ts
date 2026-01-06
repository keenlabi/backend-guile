export class ProfileUser {
	email: string;
	passwordHash: string;
	role: string;
	status: string;
	emailVerified: boolean;
	createdAt: Date;
}

export class Profile {
	public readonly id: string;
	public readonly userId: string;
	public readonly firstName: string | null;
	public readonly lastName: string | null;
	public readonly nickname: string | null;
	public readonly createdAt?: Date;
	public readonly updatedAt?: Date;
	public readonly user?: ProfileUser | null;

	constructor(
		id: string,
		userId: string,
		firstName: string | null,
		lastName: string | null,
		nickname: string | null,
		createdAt?: Date,
		updatedAt?: Date,
		user?: ProfileUser | null,
	) {
		if (!id) throw new Error('Profile id is required');
		if (!userId) throw new Error('userId is required');

		this.id = id;
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.nickname = nickname;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.user = user;
	}

	// Updated Factory for "Empty" creation
	static createEmpty(id: string, userId: string): Profile {
		return new Profile(id, userId, null, null, null);
	}

	static create(
		id: string,
		userId: string,
		firstName: string,
		lastName: string,
		nickname: string,
	) {
		return new Profile(id, userId, firstName, lastName, nickname);
	}

	static fromPersistence(
		id: string,
		userId: string,
		firstName: string | null,
		lastName: string | null,
		nickname: string | null,
		createdAt?: Date,
		updatedAt?: Date,
		user?: ProfileUser | null,
	) {
		return new Profile(
			id,
			userId,
			firstName,
			lastName,
			nickname,
			createdAt,
			updatedAt,
			user
		);
	}
}