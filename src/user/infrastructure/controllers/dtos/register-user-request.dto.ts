import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRoleType } from 'src/user/domain/enums/user-role.enum';

export class RegisterUserRequestDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(8)
	password: string;

    @IsOptional()
    @IsEnum(UserRoleType, { message: 'Role must be either trader or admin' })
    role?: UserRoleType;
}