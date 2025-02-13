import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors({
		// TODO Add env var one day or whatever
		origin: ['http://localhost:3000'],
		credentials: true,
	});

	// TODO
	app.use(cookieParser('Here gonna be some env var or etc'));

	const config = new DocumentBuilder()
		.setTitle('Problem Solving App')
		.setDescription('API description for an app created during studying at Otus Online School')
		.setVersion('1.0')
		.addCookieAuth('accessToken')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, documentFactory);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
