import { ApiProperty } from "@nestjs/swagger"
export class UserResponseDTO{
    @ApiProperty({example: 'ed3319ef-c3ff-4ede-9343-0e13f282b7d0'})
    id: string;
    @ApiProperty({example: 'Daigo'})
    first_name: string;
    @ApiProperty({example: 'Umehara'})
    last_name: string;
    @ApiProperty({example: '027.110.740-56'})
    cpf: string;
    @ApiProperty({example: '(11) 99999-9999'})
    phone: string;
    @ApiProperty({example: 'daigoBeast'})
    nickname: string;
    @ApiProperty({example: 'sdfhbdjshvjsdhbvj'})
    password_account: string;
    @ApiProperty({example: 'daigo.umehara@gmail.com'})
    email: string;
    @ApiProperty({example: '2023-01-01T00:00:00.000Z'})
    created_at: Date;
    @ApiProperty({example: '2023-01-01T00:00:00.000Z'})
    update_at: Date;
}