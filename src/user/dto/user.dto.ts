import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 'José' })
    @IsString()
    @IsNotEmpty({
        message: 'O nome é obrigatório',
    })
    name: string;

    @ApiProperty({ example: 'jose.api@gmail.com' })
    @IsString()
    @IsEmail()
    @IsNotEmpty({
        message: 'O email é obrigatório',
    })
    email: string;

    @ApiProperty({ example: '12345' })
    @IsString()
    @IsNotEmpty({
        message: 'A senha é obrigatório',
    })
    password: string;
}

export class UserResponse {
    id: string;
    name: string;
    email: string;
    @Exclude()
    password: string;
}
