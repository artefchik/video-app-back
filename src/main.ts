import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const PORT = Number(process.env.PORT) || 5080
	const app = await NestFactory.create(AppModule)

	const config = new DocumentBuilder()
		.setTitle('Video-app')
		.setDescription('REST API documentation')
		.setVersion('1.0.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api-docs', app, document)

	app.use(cookieParser())
	await app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
}
bootstrap()
