import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from 'src/common/constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '600000s' },
        }),
    ],
    providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
