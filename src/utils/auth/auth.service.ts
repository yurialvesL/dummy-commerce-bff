/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from './models/create-user.dto';
import { ValidatorService } from '../services/validator/validator.service';
import { LoggedUserResponse } from './responses/created-user-response';
import { PrismaClient } from '@prisma/client';
import { CacheService } from 'src/shared/cache/cache.service';


@Injectable()
export class AuthService {
    private prisma = new PrismaClient()
    private PRODUCTS_CACHE_KEY = process.env.PRODUCTS_CACHE_KEY;
    constructor(
        private readonly usersService: UserService,
        private jwtService: JwtService,
        private readonly validatorService: ValidatorService,
        private readonly cacheService: CacheService
    ) { }

    async checkToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token.replace("Bearer", " "),{
                secret: process.env.SECRET
            });
        } catch (error) {
            return false;
        }
    }

    async createUser(createUserdto: CreateUserDto): Promise<LoggedUserResponse> {
        try {
            if (!this.validatorService.validateCPF(createUserdto.cpf))
                throw new HttpException('cpf invalido', HttpStatus.BAD_REQUEST);

            if (!this.validatorService.validateEmail(createUserdto.email))
                throw new HttpException('email invalido', HttpStatus.BAD_REQUEST);

            if (!this.validatorService.validatePhone(createUserdto.phone))
                throw new HttpException('Telefone invalido', HttpStatus.BAD_REQUEST);


            const userCreated = await this.usersService.CreateUser(createUserdto);

            const payload = { sub: userCreated.id, username: userCreated.nickname };

            const response: LoggedUserResponse = {
                id: userCreated.id.toString(),
                first_name: userCreated.first_name,
                last_name: userCreated.last_name,
                email: userCreated.email,
                nickname: userCreated.nickname,
                access_token: await this.jwtService.signAsync(payload)
            };

            return response;


        } catch (error) {

        }
    }

    async login(dataUser: string, pass: string): Promise<LoggedUserResponse> {

        if (this.validatorService.validateCPF(dataUser)) {
            const userFind = await this.prisma.user.findFirst({
                where: {
                    cpf: dataUser,
                },
            });

            const valid = await this.validatorService.comparePassword(pass, userFind.password_account);

            if (!valid)
                throw new UnauthorizedException('Senha invalida');

            const payload = { sub: userFind.id, username: userFind.nickname };


            const response: LoggedUserResponse = {
                id: userFind.id.toString(),
                first_name: userFind.first_name,
                last_name: userFind.last_name,
                email: userFind.email,
                nickname: userFind.nickname,
                access_token: await this.jwtService.signAsync(payload)
            };

            return response;
        }

        if (this.validatorService.validateEmail(dataUser)) {
            const userFind = await this.prisma.user.findFirst({
                where: {
                    email: dataUser,
                },
            });

            const valid = await this.validatorService.comparePassword(pass, userFind.password_account);

            if (!valid)
                throw new UnauthorizedException('Senha invalida');

            const payload = { sub: userFind.id, username: userFind.nickname };


            const response: LoggedUserResponse = {
                id: userFind.id.toString(),
                first_name: userFind.first_name,
                last_name: userFind.last_name,
                email: userFind.email,
                nickname: userFind.nickname,
                access_token: await this.jwtService.signAsync(payload)
            };

            return response;

        }

        const userFind = await this.prisma.user.findFirst({
            where: {
                nickname: dataUser,
            },
        });

        const valid = await this.validatorService.comparePassword(pass, userFind.password_account);

        if(!valid)
            throw new UnauthorizedException('Senha invalida');

        const payload = { sub: userFind.id, username: userFind.nickname };


            const response: LoggedUserResponse = {
                id: userFind.id.toString(),
                first_name: userFind.first_name,
                last_name: userFind.last_name,
                email: userFind.email,
                nickname: userFind.nickname,
                access_token: await this.jwtService.signAsync(payload)
            };

            return response;


    }


    async logOut(){
        this.cacheService.del(this.PRODUCTS_CACHE_KEY);
    }

}
