import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { jwtConstants } from 'src/common/constants';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(
        email: string,
        password: string,
    ): Promise<{ access_token: string }> {
        const user = await this.userService.findOneByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Incorrect credentials');
        }

        const payload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getAuthenticatedUser(request: Request) {
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
        });

        const user = await this.userService.findOneById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
