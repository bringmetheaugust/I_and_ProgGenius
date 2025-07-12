import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { Key } from './app.types';

@Entity('keys')
export class KeyEntity {
    @PrimaryColumn()
    keyName: Key;

    @Column({ default: 0 })
    count: number;
}
