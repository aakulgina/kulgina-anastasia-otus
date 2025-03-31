import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useGlobalPipes(new ValidationPipe());

	app.enableCors({
		// TODO Add env var one day or whatever
		origin: ['http://localhost:3000'],
		credentials: true,
	});

	// TODO
	app.use(cookieParser('Here gonna be some env var or etc'));

	const config = new DocumentBuilder()
		.setTitle('Problem Solving App')
		.setDescription(
			'API description for an app created during studying at Otus Online School',
		)
		.setVersion('1.0')
		.addCookieAuth('accessToken')
		.addGlobalResponse({
			status: 429,
			description: 'Too many requests error: Rate limit exceeded',
		})
		.addGlobalResponse({
			status: 500,
			description: 'Any internal error occured',
		})
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, documentFactory);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
