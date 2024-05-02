import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { RolesModule } from './roles/roles.module'
import { DbModule } from './db/db.module'

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot({
			envFilePath: `.env`,
		}),
		RolesModule,
		DbModule,
	],
	controllers: [],
	providers: [],
	exports: [],
})
export class AppModule {}
