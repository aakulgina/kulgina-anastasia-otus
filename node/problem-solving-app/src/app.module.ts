import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ProblemModule } from './modules/problem/problem.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [UserModule, ProblemModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule { }
