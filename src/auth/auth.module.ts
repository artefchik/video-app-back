import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DbModule } from '../db/db.module'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import * as process from 'node:process'

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		DbModule,
		forwardRef(() => UsersModule),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'secret',
			signOptions: { expiresIn: '15m' },
		}),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
