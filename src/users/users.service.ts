import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { Guid } from 'guid-typescript';
import { CreateUserDto } from 'src/utils/auth/models/create-user.dto';
import { ValidatorService } from 'src/utils/services/validator/validator.service';



@Injectable()
export class UserService {
    prisma = new PrismaClient()
    constructor(private readonly validatorService: ValidatorService) { }



    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
        },
        {
            userId: 2,
            username: 'maria',
            password: 'guess',
        },
    ];

    //   async findOne(username: string): Promise<User | undefined> {
    //     return this.users.find(user => user.username === username);
    //   }


    //   async user(
    //     userWhereUniqueInput: Prisma.,
    //   ): Promise<User | null> {
    //     return this.prisma.user.findUnique({
    //       where: userWhereUniqueInput,
    //     });
    //   }

    async getById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id,
            }
        });
    }

    async getAll() {
        return this.prisma.user.findMany();
    }

    async CreateUser(createUserDto: CreateUserDto) {

        createUserDto.id = Guid.create();
        createUserDto.created_at = new Date();
        createUserDto.update_at = createUserDto.created_at;


        const userCreated = await this.prisma.user.create({
            data: {
                id: createUserDto.id.toString(),
                first_name: createUserDto.first_name,
                last_name: createUserDto.last_name,
                cpf: createUserDto.cpf,
                phone: createUserDto.phone,
                nickname: createUserDto.nickname,
                password_account: await this.validatorService.hashPassword(createUserDto.password_account),
                email: createUserDto.email,
                created_at: this.formatDateToISOString(createUserDto.created_at),
                update_at: this.formatDateToISOString(createUserDto.update_at)
            }

        });

        if (userCreated == null)
            throw new HttpException('Houve um erro na criação do usuário', HttpStatus.BAD_REQUEST);

        return createUserDto;

    }

    async updatePass(cpf: string, pass: string, newpass: string): Promise<boolean>{
        if(!this.validatorService.validateCPF(cpf))
            throw new BadRequestException('CPF invalido');

        const user = await this.prisma.user.findFirst({
            where:{
                cpf: cpf
            }
        });

        if(user == null)
            throw new NotFoundException("Usuário não encontrado, verifique se o CPF informado é correto ");

        const valid = await this.validatorService.comparePassword(pass,user.password_account);

        if(!valid)
            throw new BadRequestException("Senha invalida, digite a senha antiga corretamente")

        const newHash = await this.validatorService.hashPassword(newpass);

        const updateUser = await this.prisma.user.update({
            where:{
                cpf: cpf
            },
            data:{
                password_account: newHash,
            },
        });

        if(updateUser == null)
            throw new BadRequestException("Erro ao atualizar o usuário, informe a administração do sistema");

        return true;

    }

    async deleteUser(cpf: string): Promise<boolean>{
        if(!this.validatorService.validateCPF(cpf))
            throw new BadRequestException("Erro ao encontrar o usuário, verifique se o cpf cadastrado está correto")

        const deleteUser = await this.prisma.user.delete({
            where:{
                cpf: cpf
            },
        });

        if(deleteUser == null)
            throw new BadRequestException("Não foi possivel deletar este usuário")

        return true;
    }

    formatDateToISOString(date: Date): string {
        const year: number = date.getFullYear();
        const month: string = String(date.getMonth() + 1).padStart(2, '0');
        const day: string = String(date.getDate()).padStart(2, '0');
        const hours: string = String(date.getHours()).padStart(2, '0');
        const minutes: string = String(date.getMinutes()).padStart(2, '0');
        const seconds: string = String(date.getSeconds()).padStart(2, '0');
        const milliseconds: string = String(date.getMilliseconds()).padStart(3, '0');
        const timezoneOffset: number = -date.getTimezoneOffset();
        const timezoneOffsetSign: string = timezoneOffset >= 0 ? '+' : '-';
        const timezoneOffsetHours: string = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const timezoneOffsetMinutes: string = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
    }


}