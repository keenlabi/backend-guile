// src/config/config.schema.ts
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: Joi.number().default(6100),
	// FRONTEND_URL: Joi.string().uri().required(),

	// Database
	DATABASE_HOST: Joi.string().required(),
	DATABASE_PORT: Joi.number().required(),
	DATABASE_USER: Joi.string().required(),
	DATABASE_PASSWORD: Joi.string().allow(''),
	DATABASE_NAME: Joi.string().required(),

	JWT_ACCESS_SECRET: Joi.string().required(),
	JWT_REFRESH_SECRET: Joi.string().required(),
	JWT_ACCESS_EXPIRATION: Joi.number().required(),
	JWT_REFRESH_EXPIRATION: Joi.number().required(),

	REDIS_HOST: Joi.string().default('localhost'),
	REDIS_PORT: Joi.number().default(6379),

	// Google OAuth
	// GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
	// GOOGLE_CLIENT_ID: Joi.string().required(),
	// GOOGLE_CLIENT_SECRET: Joi.string().required(),
});
