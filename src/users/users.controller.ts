import { Controller, Delete, Get, HttpStatus, Put, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/utils/auth/auth.guard';

@ApiTags('User')
@UseGuards(AuthGuard)

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) { }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Return all users registered' })
    @Get('get-all')
    getAll() {
        return this.usersService.getAll();
    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Return user by id' })
    @Get('get-by-id')
    @ApiQuery({ name: 'id' })
    getById(@Query('id') id: string) {
        return this.usersService.getById(id);
    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Update user password' })
    @Put('update-password')
    @ApiQuery({name:'cpf'})
    @ApiQuery({name:'pass'})
    @ApiQuery({name:"newPass"})
    async updatePassword(@Query('cpf') cpf:string, @Query('pass') pass:string, @Query('newPass') newPass:string, @Res() res: Response ){
        const isUpdated = await this.usersService.updatePass(cpf,pass, newPass);
        if(isUpdated)
            res.status(HttpStatus.OK).json('password updated successfully');

    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Delete user' })
    @Delete('delete-user')
    @ApiQuery({name: 'CPF'})
    async deleteUser(@Query('CPF') cpf: string, @Res() res: Response){
        const isDeleted =  await this.usersService.deleteUser(cpf);
        if(isDeleted)
            res.status(HttpStatus.OK).json('user deleted successfully')
    }

}

