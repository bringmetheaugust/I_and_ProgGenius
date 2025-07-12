import { KeyEntity } from "./app.entity";
import { Key } from "./app.types";

export interface KeyPageDTO {
    key: KeyEntity;
    prevKey: string | null;
    nextKey: string | null;
}

export type KeyMapDTO = Record<Key, KeyEntity['count']>;
