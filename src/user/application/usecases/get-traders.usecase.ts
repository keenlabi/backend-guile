import { Inject, Injectable } from '@nestjs/common';
import * as profileRepositoryInterface from 'src/user/domain/repositories/profile.repository.interface';

@Injectable()
export class GetTradersUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: profileRepositoryInterface.IProfileRepository,
  ) {}

  async execute() {
    const profiles = await this.profileRepository.findAllTraders();

    return profiles.map((profile) => ({
      userId: profile.userId,
      email: profile.user?.email,
      email_verified: profile.user?.emailVerified,
      role: profile.user?.role,
      status: profile.user?.status,
      createdAt: profile.user?.createdAt,
      isManaged: profile.isManaged,
      profileCreatedAt: profile.createdAt,
      firstName: profile.firstName,
      lastName: profile.lastName,
    }));
  }
}