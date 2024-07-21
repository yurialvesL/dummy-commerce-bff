import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { ValidatorService } from 'src/utils/services/validator/validator.service';
import { AuthService } from 'src/utils/auth/auth.service';
import { CacheService } from 'src/shared/cache/cache.service';
import { CacheModule } from '@nestjs/cache-manager';



@Module({
  imports:[CacheModule.register()],
  providers: [UserService,ValidatorService,AuthService,CacheService],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
