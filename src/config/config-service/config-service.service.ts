import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
@Injectable()
export class ConfigService {
    private readonly envConfig: Record<string, string>;
    constructor(configFilePath: string) {
        console.log('--------------'+configFilePath+'---------------------------')
        this.envConfig = dotenv.parse(fs.readFileSync(configFilePath));
    }
    get(key: string): string {
        return this.envConfig[key];
    }
}
