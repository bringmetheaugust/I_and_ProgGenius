export interface KeyDTO {
    keyName: string;
    count: number;
}

export interface KeyPageDTO {
    key: KeyDTO;
    prevKey: string | null;
    nextKey: string | null;
}

export type KeyMapDTO = Record<KeyDTO['keyName'], KeyDTO['count']>;
