import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
	IRefreshTokenRepository,
	RefreshTokenData,
} from '../../../domain/repositories/refresh-token.repository.interface';

interface StoredRefreshToken {
	userId: string;
	expiresAt: string; // ISO string in Redis
}

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
	private readonly redis: Redis;
	private readonly PREFIX = 'refresh_token:';

	constructor() {
		this.redis = new Redis({
			host: process.env.REDIS_HOST || 'localhost',
			port: parseInt(process.env.REDIS_PORT || '6379', 10),
			password: process.env.REDIS_PASSWORD,
		});
	}

	async save(userId: string, token: string, expiresAt: Date): Promise<void> {
		const ttlSeconds = Math.floor(
			(expiresAt.getTime() - Date.now()) / 1000,
		);

		await this.redis.setex(
			`${this.PREFIX}${token}`,
			ttlSeconds,
			JSON.stringify({ userId, expiresAt: expiresAt.toISOString() }),
		);
	}

	async find(token: string): Promise<RefreshTokenData | null> {
		const data = await this.redis.get(`${this.PREFIX}${token}`);

		if (!data) return null;

		const parsed: StoredRefreshToken = JSON.parse(
			data,
		) as StoredRefreshToken;

		return {
			userId: parsed.userId,
			expiresAt: new Date(parsed.expiresAt),
		};
	}

	async delete(token: string): Promise<void> {
		await this.redis.del(`${this.PREFIX}${token}`);
	}

	async deleteAllForUser(userId: string): Promise<void> {
		const keys = await this.redis.keys(`${this.PREFIX}*`);

		for (const key of keys) {
			const data = await this.redis.get(key);
			if (data) {
				const parsed: StoredRefreshToken = JSON.parse(
					data,
				) as StoredRefreshToken;

				if (parsed.userId === userId) {
					await this.redis.del(key);
				}
			}
		}
	}
}
