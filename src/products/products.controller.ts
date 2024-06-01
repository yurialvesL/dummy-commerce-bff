import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { ProductsService } from './products.service';

@ApiTags('Products')
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Get all products from dummy json api and set in cache' })
    @Get('get-all-products')
    async getProducts() {
        return this.productService.getProducts();
    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({summary: 'Get all products from an especific category'})
    @Get('get-all-products-by-category')
    @ApiQuery({ name: 'category' })
    async getProductsByCategory(@Query('category') category: string) {
        return await this.productService.getProductsByCategory(category)
    }


    @ApiBearerAuth('Bearer')
    @ApiOperation({summary: 'Get all product categories'})
    @Get('get-all-categories')
    async getAllCategory() {
        return await this.productService.getCategories();
    }


    @ApiBearerAuth('Bearer')
    @ApiOperation({summary: 'Get 10 products best selling products'})
    @Get('get-best-selling-products')
    async getBestSellingProducts() {
        return await this.productService.getBestSellingProducts();
    }

    @ApiBearerAuth('Bearer')
    @ApiOperation({summary: 'Get 10 products that are on the biggest promotion'})
    @Get('get-best-deal-products')
    async getBestDealProducts() {
        return await this.productService.getBestProdutcsDeals();
    }


    
}