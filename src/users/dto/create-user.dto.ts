import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateUserDto {
	@IsString({ message: 'String' })
	@ApiProperty({ example: 'name@gmail.com', description: 'E-mail' })
	readonly email: string
	@Length(4, 16, { message: '4-16' })
	@ApiProperty({ example: '123456789', description: 'Password' })
	readonly password: string
}

export class User {
	@ApiProperty({ example: '1', description: 'id' })
	id: number
	@ApiProperty({ example: 'name@gmail.com', description: 'E-mail' })
	readonly email: string
}
