import { HttpException, Inject, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { BaseService } from 'src/providers/service-base/base/base.service';
import { HttpBaseService } from 'src/providers/service-base/base/http-base-service.service';
import { Products } from './models/products.dto';
import { AxiosError } from 'axios';
import { CacheService } from 'src/shared/cache/cache.service';
import { Category } from './models/category';

@Injectable()
export class ProductsService extends BaseService {
    private PRODUCTS_CACHE_KEY = process.env.PRODUCTS_CACHE_KEY;
    private data_cache: any;

    private dummyJsonUrl: string = this.DUMMY_JSON_URL;
    constructor(private readonly httpService: HttpBaseService, private readonly cacheService: CacheService) {
        super();
    }


    async getProducts(): Promise<Products[]> {
        const { data } = await firstValueFrom((await this.httpService.get(`${this.dummyJsonUrl}/products`, null)).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ),
        );
        await this.cacheService.set(this.PRODUCTS_CACHE_KEY, data.products);
        return data;
    }

    async getProductsByCategory(category: string): Promise<Products[]> {

        this.data_cache = await this.cacheService.get(this.PRODUCTS_CACHE_KEY);

        if (!this.data_cache)
            throw new HttpException('No products found', 404);

        const result = this.data_cache.filter((x: Products) => x.category.toLocaleLowerCase() == category.toLocaleLowerCase());

        return result;
    }

    async getCategories(): Promise<Category[]> {
        this.data_cache = await this.cacheService.get(this.PRODUCTS_CACHE_KEY);

        if (!this.data_cache)
            throw new HttpException('No categories found', 404);

        const categories = this.data_cache.map((x: Products) => x.category);

        const finalResult = categories.filter((valor, indice, self) => {
            return self.indexOf(valor) === indice;
        });

        return finalResult;

    }

    async getBestSellingProducts() {
        this.data_cache = await this.cacheService.get(this.PRODUCTS_CACHE_KEY);

        if (!this.data_cache)
            throw new HttpException('No products found', 404);

        const result = this.data_cache.sort((a, b) => a.stock - b.stock).slice(0, 10);

        return result;
    }

    async getBestProdutcsDeals() {
        this.data_cache = await this.cacheService.get(this.PRODUCTS_CACHE_KEY);

        if (!this.data_cache)
            throw new HttpException('No products found', 404);

        const result = this.data_cache.sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 10);

        return result;
    }
}


