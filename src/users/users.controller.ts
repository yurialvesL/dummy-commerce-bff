import { Body, Controller, Delete, Get, HttpStatus, Put, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { updateUserDto } from './models/update-user.dto';
import { UserResponseDTO } from './models/user-response.dto';

@ApiTags('User')
@UseGuards(AuthGuard)

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) { }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Return all users registered' })
    @Get('get-all')
    async getAll(@Res() response:Response) {
        const users = await this.usersService.getAll();

        if(users){
            response.status(HttpStatus.OK).json(users);
            return;
        }
            
        response.status(HttpStatus.BAD_REQUEST).json('users not found');
    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Return user by id' })
    @Get('get-by-id')
    @ApiQuery({ name: 'id' })
    async getById(@Query('id') id: string,@Res() response:Response) {

        const user = await this.usersService.getById(id);
        if(user){
            response.status(HttpStatus.OK).json(user);
            return;
        }

        response.status(HttpStatus.BAD_REQUEST).json('user not found');
    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({summary: 'Update personal data from user'})
    @Put('update-personal-data')
    @ApiQuery({name:'cpf'})
    @ApiBody({type:updateUserDto})
    @ApiResponse({type:UserResponseDTO})
    async updatePersonalData(@Query('cpf') cpf:string, @Body() updatePersonalData: updateUserDto, @Res() response:Response){
        const isUpdated = await this.usersService.updatePersonalData(cpf, updatePersonalData);
        if(isUpdated){
            response.status(HttpStatus.OK).json(isUpdated);
            return;
        }
            
        response.status(HttpStatus.BAD_REQUEST).json('failed to update user');
    } 

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Update user password' })
    @Put('update-password')
    @ApiQuery({name:'cpf'})
    @ApiQuery({name:'pass'})
    @ApiQuery({name:"newPass"})
    async updatePassword(@Query('cpf') cpf:string, @Query('pass') pass:string, @Query('newPass') newPass:string, @Res() res: Response ){
        const isUpdated = await this.usersService.updatePass(cpf,pass, newPass);
        if(isUpdated){
            res.status(HttpStatus.OK).json('password updated successfully');
            return;
        }
            
        res.status(HttpStatus.BAD_REQUEST).json('failed to update password');

    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Delete user' })
    @Delete('delete-user')
    @ApiQuery({name: 'CPF'})
    async deleteUser(@Query('CPF') cpf: string, @Res() res: Response){
        const isDeleted =  await this.usersService.deleteUser(cpf);
        if(isDeleted){
            res.status(HttpStatus.OK).json('user deleted successfully');
            return;
        }

        res.status(HttpStatus.BAD_REQUEST).json('failed to delete user');   
    }

}

