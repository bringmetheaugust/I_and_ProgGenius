// зробив як окремиму feature, так як може знагодиться на різних сторінках

import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { KeyMapDTO } from '@entities/model/dto';
import { WS_URL } from '@shared/api';

/**
 * @description підписується на WS і віддає callBack для події
 * @param messageCallback подія яка спрацює при отримані нового повідомленя по сокету
 * @returns {
 *      wsState - стан підключення
 *      actionHandler - callBack для відправки даних події
 * }
 * @example
 * const { wsState, actionHandler } = useClientKeyboardHandler('key_press', myMessageCallBack);
 */
export default function useClientKeyboardHandler<T>(
    messageCallback: (data: KeyMapDTO) => void,
): {
    wsState: boolean; actionHandler: (data: T) => void
} {
    const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>(null);
    const [connected, setConnected] = useState<boolean>(false);

    const actionHandler = useCallback((data: T) => {
        connected && socketRef.current?.emit('key_pressed', data); // не викликати якщо немає/зникло підключення
    }, [connected]);

    useEffect(() => {
        socketRef.current = io(`${WS_URL}/events`);
        socketRef.current.on('connect', () => {
            setConnected(true);
        });
        socketRef.current.on('error', () => {
            setConnected(false);
        });
        socketRef.current.on('keys_updated', (keys: KeyMapDTO) => {
            messageCallback(keys);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return { wsState: connected, actionHandler };
}
