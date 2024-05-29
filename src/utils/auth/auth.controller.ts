import { Body, Controller, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBody, ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './models/create-user.dto';
import { LoggedUserResponse } from './responses/created-user-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
constructor(private authService:AuthService){}

    // @HttpCode(HttpStatus.OK)
    // @Post('login')
    // signIn(@Body() signInDto: Record<string,any>){
    //     return this.authService.signIn(signInDto.username, signInDto.password);
    // }

    @Post('register')
    @ApiBody({type:CreateUserDto})
    @ApiCreatedResponse({
        description:'The user has been successfuly created.',

    })
    async register(@Body() createUserdto: CreateUserDto) : Promise<LoggedUserResponse>{
        return await this.authService.createUser(createUserdto);
    }

    @Post('login')
    @ApiQuery({name:'user'})
    @ApiQuery({name:'pass'})
    async signIn(@Query('user') user:string, @Query('pass') pass:string, @Res() res: Response){
        const loggedUser = await this.authService.login(user,pass);
        res.status(HttpStatus.OK).json(loggedUser);
    }

}
