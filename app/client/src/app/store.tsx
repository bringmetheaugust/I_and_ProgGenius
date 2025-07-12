'use client';

import { createContext, useContext, ReactNode } from 'react';

import { KeysStore } from '@entities/model/store';
import { KeyMapDTO } from '@entities/model/dto';

export interface RootStore {
    keysStore: KeysStore;
}

let clientStore: RootStore | null = null;

const StoreContext = createContext<RootStore | null>(null);

export function initializeStore(initialData?: { keys?: KeyMapDTO }): RootStore {
    const _store: RootStore = { keysStore: new KeysStore() };

    if (initialData?.keys) _store.keysStore.hydrate(initialData.keys);

    if (typeof window === 'undefined') return _store;

    if (!clientStore) clientStore = _store;

    return clientStore;
}

export const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) throw new Error('StoreProvider is missing');

    return store;
};

export const StoreProvider = ({ children, initialData }: {
    children: ReactNode;
    initialData?: { keys?: KeyMapDTO };
}) => {
    const store = initializeStore(initialData);

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
