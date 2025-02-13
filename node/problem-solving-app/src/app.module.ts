import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [UsersModule, ProblemsModule, AuthModule],
})

export class AppModule { }
