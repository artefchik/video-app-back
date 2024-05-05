import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { DbService } from '../db/db.service'

@Injectable()
export class UsersService {
	constructor(private dbService: DbService) {}

	async createUser(dto: CreateUserDto) {
		const user = this.dbService.user.create({ data: dto })
		return user
	}

	async getAllUser() {
		const users = this.dbService.user.findMany()
		return users
	}

	async getUserByEmail(email: string) {
		const user = await this.dbService.user.findUnique({ where: { email } })
		return user
	}
}
