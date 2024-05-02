import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { DbModule } from '../db/db.module'

@Module({
	providers: [RolesService],
	controllers: [RolesController],
	exports: [],
	imports: [DbModule],
})
export class RolesModule {}
