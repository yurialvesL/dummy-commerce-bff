import { HttpException, Injectable } from '@nestjs/common';
import {  catchError, firstValueFrom } from 'rxjs';
import { BaseService } from 'src/providers/service-base/base/base.service';
import { HttpBaseService } from 'src/providers/service-base/base/http-base-service.service';
import { Products } from './models/products.dto';
import { AxiosError } from 'axios';

@Injectable()
export class ProductsService extends BaseService {

    private dummyJsonUrl: string = this.DUMMY_JSON_URL;
    constructor(private readonly httpService: HttpBaseService) {
        super();
    }


    async getProducts(): Promise<Products[]> {
        const { data } = await firstValueFrom((await this.httpService.get(`${this.dummyJsonUrl}/products`, null)).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ),
        ); 
        return data;
    }

}
