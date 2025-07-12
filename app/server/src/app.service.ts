import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { KeyEntity } from './app.entity';
import { Key } from './app.types';
import { KeyMapDTO, KeyPageDTO } from './app.dto';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(KeyEntity) private readonly appRepo: Repository<KeyEntity>,
        private dataSource: DataSource,
    ) { }

    async getKeysList(): Promise<KeyMapDTO> {
        const res = await this.appRepo.find();

        return res.reduce<KeyMapDTO>((acc, key) => ({ ...acc, [key.keyName]: key.count }), {});
    }

    async getKeyData(keyName: Key): Promise<KeyPageDTO> {
        // в цьому запиті беремо очікувану клавішу та previous & next клавішу по count для навігації
        // як альтернатива, можна брати this.getKeysList() та шукати previous & next клавіші через js, але SQL запити в пріорітеті
        // вимушений уточнити, з таким SQL запитом трохи GPT допоміг
        const result = await this.dataSource.query(
            `
            WITH target AS (
                SELECT * FROM keys WHERE "keyName" = $1
            )
            SELECT
                (SELECT "keyName" FROM keys WHERE count < (SELECT count FROM target) ORDER BY count DESC LIMIT 1) AS "nextKey",
                to_jsonb(target.*) AS key,
                (SELECT "keyName" FROM keys WHERE count > (SELECT count FROM target) ORDER BY count ASC LIMIT 1) AS "prevKey"
                FROM target;
            `,
            [keyName],
        ) as KeyPageDTO[];

        if (!result.length) throw new NotFoundException(`Key ${keyName} not found`);

        return result[0];
    }

    async updateKeysData(keys: KeyMapDTO): Promise<void> {
        await this.dataSource.transaction(async (manager) => { // транзакція для оптимізації, так як обновлюватись може не тільки одна клавіша
            for (const [keyName, count] of Object.entries(keys)) {
                await manager.query(
                    `
                    INSERT INTO keys ("keyName", count)
                    VALUES ($1, $2)
                    ON CONFLICT ("keyName")
                    DO UPDATE SET count = keys.count + $2
                    `,
                    [keyName, count]
                );
            }
        })
    }
}
