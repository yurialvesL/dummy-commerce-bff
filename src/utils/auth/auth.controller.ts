import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './models/create-user.dto';
import { LoggedUserResponse } from './responses/created-user-response';
import { UserService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
constructor(private authService:AuthService,
            private userService:UserService
){}

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


    @Get('check-nickname')
    @ApiOperation({summary:'Check if the nickname already exists'})
    @ApiQuery({name:'nickname'})
    async checkNickname(@Query('nickname') nickname: string,@Res() res: Response){
        const result = await this.userService.checkNickname(nickname);

        if(!result){
            res.status(HttpStatus.OK).json({message:"Nickname doesn't exists",exists:false});
            return;
        }
        
        res.status(HttpStatus.CONFLICT).json({message:'Nickname already exists',exists:true});
    }

}
