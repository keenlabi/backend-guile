declare namespace Express {
	interface Request {
		cookies: {
			accessToken?: string;
			refreshToken?: string;
			[key: string]: string | undefined;
		};
	}
}
