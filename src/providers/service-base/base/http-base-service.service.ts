import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class HttpBaseService {
    constructor(private readonly httpService:HttpService) { }


    async get(url:string, params:any) {
        try {
           return  this.httpService.get(url, { params })
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }

    async post(url:string, data:any) {
        try {
           this.httpService.post(url, data).subscribe(data => {
                return data;
            });
            
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }


    async put(url:string, data:any) {
        try {
            this.httpService.put(url, data).subscribe(data => {
                return data;
            });
            
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }

    async delete(url:string) {
        try {
            this.httpService.delete(url).subscribe(data =>{
                return data;
            })
        
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }
}

