import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@ApiOperation({ summary: 'Create a user' })
	@ApiResponse({
		status: 200,
	})
	@Post()
	create(@Body() userDto: CreateUserDto) {
		return this.userService.createUser(userDto)
	}

	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({ status: 200 })
	@UseGuards(AuthGuard)
	@Get()
	getAll() {
		return this.userService.getAllUser()
	}
}
