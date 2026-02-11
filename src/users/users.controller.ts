import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }



  @Put(':id')
  updateFull(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(+id, dto);
  }


  @Patch(':id')
  updatePartial(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(+id, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(+id);
  }

}
