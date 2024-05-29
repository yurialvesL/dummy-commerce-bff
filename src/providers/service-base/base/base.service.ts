import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
    public readonly DUMMY_JSON_URL: string= process.env.DUMMY_JSON_URL;

}
