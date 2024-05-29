import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { ValidatorService } from 'src/utils/services/validator/validator.service';
import { AuthService } from 'src/utils/auth/auth.service';


@Module({
  providers: [UserService,ValidatorService,AuthService],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
