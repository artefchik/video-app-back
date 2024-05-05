import {
	ArgumentMetadata,
	HttpException,
	HttpStatus,
	Injectable,
	PipeTransform,
} from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype) {
			return value
		}
		const object = plainToInstance(metatype, value)
		const errors = await validate(object)
		if (errors.length) {
			const messages = errors.reduce((accum, error) => {
				const errros = Object.values(error.constraints ?? {}).join('')
				accum[error.property] = errros
				return accum
			}, {})
			throw new HttpException(messages, HttpStatus.BAD_REQUEST)
		}
		return value
	}
}
