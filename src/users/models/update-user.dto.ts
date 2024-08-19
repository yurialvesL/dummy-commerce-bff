import { ApiProperty } from "@nestjs/swagger"


export class updateUserDto{
    @ApiProperty({example:'Bruce'})
    first_name: string
    @ApiProperty({example:'Wayne'})
    last_name: string
    @ApiProperty({example:'brucewayne@gmail.com'})
    email: string
    @ApiProperty({example:'+55(11)95387-9046'})
    phone: string
    @ApiProperty({example:'Batman'})
    nickname:string
}