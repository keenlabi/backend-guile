export interface RefreshTokenData {
	userId: string;
	expiresAt: Date;
}

export interface IRefreshTokenRepository {
	save(userId: string, token: string, expiresAt: Date): Promise<void>;
	find(token: string): Promise<RefreshTokenData | null>;
	delete(token: string): Promise<void>;
	deleteAllForUser(userId: string): Promise<void>;
}
