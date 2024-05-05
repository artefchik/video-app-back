import { forwardRef, Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DbModule } from '../db/db.module'
import { AuthModule } from '../auth/auth.module'

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [DbModule, forwardRef(() => AuthModule)],
	exports: [UsersService],
})
export class UsersModule {}
