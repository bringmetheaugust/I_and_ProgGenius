import { makeAutoObservable, observable } from 'mobx';

import { KeyDTO, KeyMapDTO } from './dto';

export class KeysStore {
    keys = observable.map<string, number>();

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    hydrate(data?: KeyMapDTO): void {
        if (data) this.keys.replace(data);
    }

    updateKeys(keys: KeyMapDTO): void {
        for (const key in keys) {
            const currentKey = this.keys.get(key) ?? 0;

            this.keys.set(key, currentKey + keys[key]);
        }
    }

    get asArray(): KeyDTO[] {
        return Array.from(this.keys.entries()).map(([keyName, count]) => ({
            keyName,
            count,
        }));
    }
}
