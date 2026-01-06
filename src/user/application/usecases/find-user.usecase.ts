import { Inject, Injectable } from '@nestjs/common';
import * as userRepositoryInterface from 'src/user/domain/repositories/user.repository.interface';
import * as profileRepositoryInterface from 'src/user/domain/repositories/profile.repository.interface';
import { UserNotFoundError } from '../errors/user.errors';
import { UserGeneralProfileDto } from '../dtos/user-general-profile.dto';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: userRepositoryInterface.IUserRepository,
    @Inject('IProfileRepository')
    private readonly profileRepository: profileRepositoryInterface.IProfileRepository,
  ) {}

  async execute(userId: string): Promise<UserGeneralProfileDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const profile = await this.profileRepository.findByUserId(userId);

    return {
      id: user.id,
      email: user.email.value,
      emailVerified: user.emailVerified,
      status: user.status.value,
      role: user.role.value,
      createdAt: user.createdAt,
      
      firstName: profile?.firstName ?? null,
      lastName: profile?.lastName ?? null
    };
  }
}