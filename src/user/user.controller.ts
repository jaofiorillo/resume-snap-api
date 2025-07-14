import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/decorators/decorators';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Public()
    async create(@Body() user: UserDto) {
        await this.userService.create(user);
    }

    @Get()
    async getAll() {
        return await this.userService.getAll();
    }

    @Put('/update/:id')
    async update(@Param('id') id: string, @Body() user: UserDto) {
        return await this.userService.update(id, user);
    }
}
