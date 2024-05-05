import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { ValidationPipe } from '../pipes/validation.pipe'
import { Request, Response } from 'express'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	async login(
		@Body() userDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, ...user } = await this.authService.login(userDto)
		this.authService.addRefreshTokenInCookies(res, refreshToken)
		return user
	}

	@UsePipes(ValidationPipe)
	@Post('/registration')
	async registration(
		@Body() userDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, ...user } =
			await this.authService.registration(userDto)
		this.authService.addRefreshTokenInCookies(res, refreshToken)
		return user
	}

	@Post('/logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenInCookies(res)
		return true
	}

	@Get('/token')
	async getToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const refreshTokenInCookies = req.cookies['refreshToken']
		if (!refreshTokenInCookies) {
			this.authService.removeRefreshTokenInCookies(res)
			throw new UnauthorizedException('Refresh token not passed')
		}
		const { refreshToken, ...user } = await this.authService.getNewTokens(
			refreshTokenInCookies,
		)
		this.authService.addRefreshTokenInCookies(res, refreshToken)
		return user
	}
}
