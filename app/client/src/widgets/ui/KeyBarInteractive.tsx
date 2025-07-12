'use client';

import { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import KeyBar from '@entities/ui/KeyBar';
import { useStore } from '@app/store';
import useClientKeyboardHandler from '@features/useClientKeyboardHandler';
import { KeyDTO } from '@entities/model/dto';
import { interceptSpaceKey } from '@shared/utils';

export const KeyBarInteractive = () => {
    const { keysStore } = useStore();
    const { wsState, actionHandler } = useClientKeyboardHandler<KeyDTO['keyName']>(keysStore.updateKeys);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        actionHandler(interceptSpaceKey(e.key));
    }, [actionHandler]);

    useEffect(() => {
        if (!wsState) return window.removeEventListener('keydown', onKeyDown); // відписуємось якщо зв'язок з WS пропаде

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [wsState]);

    // завдяки selective hydration в нас клієнський компонент рендериться в SSR
    return <KeyBar keys={keysStore.asArray} />;
};

export default observer(KeyBarInteractive);
