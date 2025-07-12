import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';
import { KeyMapDTO, KeyPageDTO } from './app.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get('keys')
    private getKeyListData(): Promise<KeyMapDTO> {
        return this.appService.getKeysList();
    }

    @Get('key/:keyName')
    private getKeyData(
        @Param('keyName') keyName: string,
    ): Promise<KeyPageDTO> {
        return this.appService.getKeyData(keyName);
    }
}
