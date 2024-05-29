import { ApiProperty } from "@nestjs/swagger"
import { Guid } from "guid-typescript"

export class CreateUserDto{
    id: Guid
    @ApiProperty({example:'Thiago'})
    first_name: string
    @ApiProperty({example:'Vi Adão'})
    last_name: string
    @ApiProperty({example:'052.419.180-86'})
    cpf: string
    @ApiProperty({example:'(19) 98051-6535'})
    phone: string
    @ApiProperty({example:'suga tudo'})
    nickname: string
    @ApiProperty({example:'bocadeveludo123'})
    password_account: string
    @ApiProperty({example:'calcinhapreta@gmail.com'})
    email: string
    created_at : Date
    update_at: Date

    constructor(){
        this.id = Guid.create();
        this.created_at = new Date();
        this.update_at =   this.created_at;
    }
}