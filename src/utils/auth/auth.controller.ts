import { Body, Controller, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './models/create-user.dto';
import { LoggedUserResponse } from './responses/created-user-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
constructor(private authService:AuthService){}

    @Post('register')
    @ApiBody({type:CreateUserDto})
    @ApiOperation({summary:'Create a new user and return token for other requisitions'})
    @ApiCreatedResponse({
        description:'The user has been successfuly created.',
    })
    async register(@Body() createUserdto: CreateUserDto) : Promise<LoggedUserResponse>{
        return await this.authService.createUser(createUserdto);
    }

    @Post('login')
    @ApiOperation({summary:'Login to the system and return a token'})
    @ApiQuery({name:'user'})
    @ApiQuery({name:'pass'})
    async signIn(@Query('user') user:string, @Query('pass') pass:string, @Res() res: Response){
        const loggedUser = await this.authService.login(user,pass);
        res.status(HttpStatus.OK).json(loggedUser);
    }

    @Post('logout')
    @ApiOperation({summary:'Logout from the system'})
    async logout(@Res() res: Response){
        await this.authService.logOut();  
        res.status(HttpStatus.OK).json({message:'Logout successufuly'});
    }

}
