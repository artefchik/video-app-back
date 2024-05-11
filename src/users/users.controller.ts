import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto, User } from './dto/create-user.dto';
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@ApiOperation({ summary: 'Create a user' })
	@ApiOkResponse({
		type: User,
	})
	@HttpCode(HttpStatus.OK)
	@Post()
	create(@Body() userDto: CreateUserDto) {
		return this.userService.createUser(userDto)
	}

	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({
		type: User,
	})
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get()
	getAll() {
		return this.userService.getAllUser()
	}
}
