import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
	@ApiProperty({ example: 'name@gmail.com', description: 'E-mail' })
	readonly email: string
	@ApiProperty({ example: '123456789', description: 'Password' })
	readonly password: string
}
