import { Inject, Injectable } from '@nestjs/common';
import * as userRepositoryInterface from 'src/user/domain/repositories/user.repository.interface';
import * as profileRepositoryInterface from 'src/user/domain/repositories/profile.repository.interface';
import { UserNotFoundError } from '../errors/user.errors';
import { UserGeneralProfileDto } from '../dtos/user-general-profile.dto';

@Injectable()
export class FindUserProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: profileRepositoryInterface.IProfileRepository,
  ) {}

  async execute(userId: string): Promise<UserGeneralProfileDto> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new UserNotFoundError();
    }

    return {
      id: profile.id,
      email: profile.user!.email,
      emailVerified: profile.user!.emailVerified,
      status: profile.user!.status,
      role: profile.user!.role,
      createdAt: profile.user!.createdAt,
      
      firstName: profile?.firstName ?? null,
      lastName: profile?.lastName ?? null
    };
  }
}