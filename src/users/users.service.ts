import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { Guid } from 'guid-typescript';
import { CreateUserDto } from 'src/utils/auth/models/create-user.dto';
import { ValidatorService } from 'src/utils/services/validator/validator.service';
import { updateUserDto } from './models/update-user.dto';
import { UserResponseDTO } from './models/user-response.dto';



@Injectable()
export class UserService {
    prisma = new PrismaClient()
    constructor(private readonly validatorService: ValidatorService) { }

    async getById(id: string): Promise<UserResponseDTO> {
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

    async checkNickname(nickname: string):Promise<boolean>{
    
     const user =   await this.prisma.user.findFirst({
            where:{
                nickname: nickname
            }
        });
     
      if(user === null)
        return false

      if(user.nickname == nickname)
        return true;

    }

    async updatePersonalData(cpf:string, data: updateUserDto): Promise<UserResponseDTO>{

        if(!this.validatorService.validateCPF(cpf))
            throw new BadRequestException("Erro ao encontrar o usuário, verifique se o cpf cadastrado está correto")

        await this.checkNickisFromTheSameUser(cpf, data);

        const user = await this.prisma.user.update({
            where:{
                cpf: cpf
            },
            data:{
                first_name: data.first_name,
                last_name: data.last_name,
                nickname: data.nickname,
                phone: data.phone,
                email: data.email,
                update_at: this.formatDateToISOString(new Date())
            }
        });

        if(user == null)
            throw new BadRequestException("Não foi possivel atualizar os dados do usuário")

        return this.getById(user.id);
    }

    async checkNickisFromTheSameUser(cpf:string,user:updateUserDto){
        const usernick =  await this.prisma.user.findUnique({
            where:{
                nickname: user.nickname
            }
        });
        if(usernick.cpf == cpf)
            return;

        const validNickname = await this.checkNickname(user.nickname);
        
        if(validNickname)
            throw new ConflictException("Nickname já está em uso");
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