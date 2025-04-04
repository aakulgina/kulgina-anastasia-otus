import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnectionOptions } from './common/typeorm';
import { SettingsModule } from './modules/settings/settings.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TagsModule } from './modules/tags/tags.module';

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
		AuthModule,
		SettingsModule,
		ProjectsModule,
		TagsModule,
	],
})
export class AppModule {
	constructor() {}
}

