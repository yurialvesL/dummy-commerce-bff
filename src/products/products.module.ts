import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { HttpBaseService } from 'src/providers/service-base/base/http-base-service.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from 'src/utils/auth/auth.service';
import { UserService } from 'src/users/users.service';
import { ValidatorService } from 'src/utils/services/validator/validator.service';

@Module({
  imports:[
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ],
  controllers: [ProductsController],
  providers: [ProductsService, HttpBaseService,AuthService,UserService,ValidatorService],
  exports: [],
})
export class ProductsModule {}
