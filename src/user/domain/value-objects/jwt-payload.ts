export interface JwtPayload {
	sub: string; // userId
	email: string;
	role: string;
	type: 'access' | 'refresh';
	iat?: number;
	exp?: number;
}
