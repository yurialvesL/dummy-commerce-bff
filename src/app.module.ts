import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './utils/auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './utils/auth/auth.controller';
import { AuthModule } from './utils/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ValidatorService } from './utils/services/validator/validator.service';
import { UserService } from './users/users.service';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { BaseService } from './providers/service-base/base/base.service';
import { HttpBaseService } from './providers/service-base/base/http-base-service.service';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from './shared/cache/cache.service';
import { CacheModule } from '@nestjs/cache-manager';



@Module({
  imports: [PrismaModule, UsersModule, AuthModule,
    ConfigModule.forRoot(),
    CacheModule.register(),
    ProductsModule,HttpModule,],
  controllers: [AuthController],
  providers: [AppService, AuthService, PrismaService, ValidatorService,UserService, ProductsService, BaseService, HttpBaseService, CacheService],
})
export class AppModule {

}
