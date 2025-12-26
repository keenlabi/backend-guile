declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test';
			PORT?: string;

			// Database
			DATABASE_HOST: string;
			DATABASE_PORT: string;
			DATABASE_USER: string;
			DATABASE_PASSWORD: string;
			DATABASE_NAME: string;

			JWT_ACCESS_SECRET: string;
			JWT_REFRESH_SECRET: string;
			JWT_ACCESS_EXPIRATION: string;
			JWT_REFRESH_EXPIRATION: string;

			REDIS_HOST: string;
			REDIS_PORT: string;
		}
	}
}

export {};
