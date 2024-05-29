import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { ValidatorService } from '../services/validator/validator.service';
import { HttpModule } from '@nestjs/axios';
;



@Module({
    imports:[
        UsersModule,
        JwtModule.register({
            global:true,
            secret:process.env.SECRET,
            signOptions:{expiresIn: process.env.EXPIRES} 
        }),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
          }),
          HttpModule
    ],
    exports:[AuthService],
    providers:[AuthService,ValidatorService]

})
export class AuthModule {}
