// // src/user/infrastructure/strategies/google.strategy.ts
// import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import {
// 	Strategy,
// 	Profile as GoogleProfile,
// 	VerifyCallback,
// } from 'passport-google-oauth20';
// import { User } from 'src/user/domain/entities/user.entity';
// import { UserIdentity } from 'src/user/domain/entities/user-identity.entity';
// import * as userRepositoryInterface from 'src/user/domain/repositories/user.repository.interface';
// import { Email } from 'src/user/domain/value-objects/email';
// import * as userIdentityInterface from 'src/user/domain/repositories/user.identity.interface';
// import { UserNotFoundError } from 'src/user/application/errors/user.errors';
// import { UserRoleValue } from 'src/shared/domain/enums/user-role.enum';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
// 	constructor(
// 		private readonly configService: ConfigService,
// 		@Inject('IUserRepository')
// 		private readonly userRepository: userRepositoryInterface.IUserRepository,
// 		@Inject('IUserIdentityRepository')
// 		private readonly userIdentityRepository: userIdentityInterface.IUserIdentityRepository,
// 	) {
// 		const clientID: string | undefined = configService.get('GOOGLE_CLIENT_ID');
// 		const clientSecret: string | undefined = configService.get('GOOGLE_CLIENT_SECRET');
// 		const callbackURL = configService.get('GOOGLE_CALLBACK_URL');

// 		if (!clientID || !clientSecret) {
// 			throw new Error('Google OAuth credentials must be configured.');
// 		}

// 		super({
// 			clientID,
// 			clientSecret,
// 			callbackURL,
// 			scope: ['email', 'profile'],
// 		});
// 	}

// 	async validate(
// 		accessToken: string,
// 		refreshToken: string,
// 		profile: GoogleProfile,
// 		done: VerifyCallback,
// 	): Promise<void> {
// 		const { id: googleId, name, emails } = profile;

// 		if (!emails || emails.length === 0 || !emails[0].value) {
// 			return done(
//                 new UnauthorizedException('Google account has no verified email.'),
// 				false,
// 			);
// 		}

// 		const email = new Email(emails[0].value);

// 		try {
// 			// 1. Check if a Google identity already exists for this user
// 			const identity = await this.userIdentityRepository.findByProvider(
// 				'google',
// 				googleId,
// 			);

// 			if (identity) {
// 				// Identity exists, validation is successful. Return the associated user.
// 				const user = await this.userRepository.findById(identity.userId);
// 				if(!user) {
// 					throw new UserNotFoundError();
// 				}

// 				const userPayload = {
// 					userId: user.id,
// 					email: user.email.value,
// 					roles: user.roleValues as UserRoleValue[],
// 				}
// 				return done(null, userPayload ?? undefined);
// 			}

// 			// 2. If identity doesn't exist, find or create the core User by email
// 			let user = await this.userRepository.findByEmail(email);

// 			if (!user) {
// 				// This is a brand new user to our system
// 				const newUser = User.create(
// 					this.userRepository.generateId(),
// 					email,
// 				);
// 				user = await this.userRepository.save(newUser);
// 				// Note: You would create the user's Profile here as well
// 			}

// 			// 3. Create the new 'google' identity and link it to the user
// 			const newIdentity = UserIdentity.createGoogle(
// 				this.userIdentityRepository.generateId(),
// 				user.id,
// 				googleId,
// 			);
// 			await this.userIdentityRepository.save(newIdentity);
// 			const userPayload = {
// 				userId: user.id,
// 				email: user.email.value,
// 				roles: user.role,
// 			}

// 			return done(null, userPayload);
// 		} catch (error) {
// 			return done(error, false);
// 		}
// 	}
// }
