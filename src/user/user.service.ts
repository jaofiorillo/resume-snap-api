import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserResponse } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async create(user: UserDto) {
        const checkEmail = await this.emailExists(user.email);

        if (checkEmail) {
            throw new BadRequestException('Existing email!');
        }

        user.password = await bcrypt.hash(user.password, 10);
        await this.userRepository.save(user);
    }

    async emailExists(email: string) {
        return await this.findOneByEmail(email);
    }

    async findOneByEmail(email: string) {
        return this.userRepository.findOne({
            where: { email },
        });
    }

    async findOneById(id: string) {
        return this.userRepository
            .findOneByOrFail({ id: id })
            .catch(() => {
                throw new NotFoundException('User not found!');
            })
            .then((user) => {
                return user;
            });
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async getAll() {
        const users_response: UserDto[] = [];
        const users = await this.findAll();

        if (!!users.length) {
            for (let user of users) {
                let user_response = plainToInstance(UserResponse, user);
                users_response.push(user_response);
            }
        }

        return users_response;
    }

    async update(id: string, user: UserDto) {
        try {
            const userCheckEmail = await this.emailExists(user.email);

            if (userCheckEmail && userCheckEmail.id != id) {
                throw new BadRequestException('Existing email!');
            }

            user.password = await bcrypt.hash(user.password, 10);
            await this.userRepository.update(id, user);
        } catch (error) {
            throw new Error(error);
        }
    }

    async delete(id: string) {
        try {
            const user = await this.findOneById(id);
            await this.userRepository.delete(user.id);

            return { deleted: true };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
