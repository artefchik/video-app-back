import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { DbModule } from './db/db.module'
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot({
			envFilePath: `.env`,
		}),
		DbModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
	exports: [],
})
export class AppModule {}
