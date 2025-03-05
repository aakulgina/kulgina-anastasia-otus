import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnectionOptions } from './common/typeorm';
import { DataSource } from 'typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot(dbConnectionOptions),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					name: 'default',
					ttl: 60_000,
					limit: 60,
				},
			],
		}),
		UsersModule,
		ProblemsModule,
		AuthModule,
	],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
