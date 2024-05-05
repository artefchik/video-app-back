import {
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { CreateUserDto, User } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as process from 'node:process'
import { Response } from 'express'

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	async login(userDto: CreateUserDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(userDto)
		const tokens = await this.generateToken(user)
		return {
			...tokens,
			...user,
		}
	}

	async registration(userDto: CreateUserDto) {
		const candidate = await this.userService.getUserByEmail(userDto.email)
		if (candidate) {
			throw new HttpException(
				'User with this email already exists',
				HttpStatus.BAD_REQUEST,
			)
		}
		const hashPassword = await bcrypt.hash(userDto.password, 7)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.createUser({
			...userDto,
			password: hashPassword,
		})
		const tokens = await this.generateToken(user)
		return {
			...user,
			...tokens,
		}
	}

	private async generateToken(user: User) {
		const payload = { id: user.id, email: user.email }
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: '15m',
		})
		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: '20d',
			secret: process.env.JWT_SECRET_REFRESH || 'JWT_SECRET_REFRESH',
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	private async validateUser(userDto: CreateUserDto) {
		const user = await this.userService.getUserByEmail(userDto.email)
		if (!user) {
			throw new UnauthorizedException('User with email does not exist')
		}
		const passwordEquals = await bcrypt.compare(
			userDto.password,
			user.password,
		)
		if (user && passwordEquals) {
			return user
		} else {
			throw new UnauthorizedException('')
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync(refreshToken, {
			secret: process.env.JWT_SECRET_REFRESH || 'JWT_SECRET_REFRESH',
		})
		if (!result) throw new UnauthorizedException('Invalid refresh token')
		const user = await this.userService.getUserByEmail(result.email)
		if (!user) {
			throw new UnauthorizedException('')
		}
		const tokens = await this.generateToken(user)
		return {
			...tokens,
			id: user.id,
			email: user.email,
		}
	}

	addRefreshTokenInCookies(res: Response, refreshToken: string) {
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			domain: 'localhost',
			maxAge: 20 * 24 * 60 * 60 * 1000,
		})
	}

	removeRefreshTokenInCookies(res: Response) {
		res.cookie('refreshToken', '', {
			httpOnly: true,
			secure: true,
			domain: 'localhost',
			expires: new Date(0),
		})
	}
}
