import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConnectionOptions: TypeOrmModuleOptions = {
	type: 'postgres',
	host: '', // 'Here gonna be some env var or etc', // TODO
	port: 5432, // 'Here gonna be some env var or etc', // TODO
	username: '', // 'Here gonna be some env var or etc', // TODO
	password: '', // 'Here gonna be some env var or etc', // TODO
	database: '', // 'Here gonna be some env var or etc', // TODO
	entities: ['dist/**/*.entity{.ts,.js}'],
	// migrations: ,
	autoLoadEntities: true,
	synchronize: process.env.MODE === 'develop',
};
