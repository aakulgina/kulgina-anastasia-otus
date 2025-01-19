import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [UsersModule, ProblemsModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule { }
