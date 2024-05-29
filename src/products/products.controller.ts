import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { ProductsService } from './products.service';

@ApiTags('Products')
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productService:ProductsService) { }

    @ApiBearerAuth('Bearer')
    @Get('get-all-products')
    async getProducts() {
        return this.productService.getProducts();
    }
}
