import {
    MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer,
} from "@nestjs/websockets";
import { bufferTime, filter, map, Subject } from "rxjs";
import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from 'socket.io';

import { Key } from "./app.types";
import { AppService } from "./app.service";
import { KeyEntity } from "./app.entity";
import { KeyMapDTO } from "./app.dto";

const BUFFER_TIMEOUT = 300;

@WebSocketGateway(81, { namespace: 'events', cors: { origin: '*' }, })
export default class AppGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private connections: Set<Socket>;
    private keyEvent$: Subject<Key>;

    constructor(private readonly appService: AppService) {
        this.connections = new Set();
        this.keyEvent$ = new Subject<Key>();
    }

    onModuleInit() {
        this.keyEvent$.pipe(
            bufferTime(BUFFER_TIMEOUT), // оптимізація. копим нажаті клавіші по 1 секунді. звичайно, можна збільшити
            filter((keys: Key[]) => keys.length > 0), // чек на пустоту
            map((keys: string[]) => // збираєм всі накопичені нажаті клавіші в один об'єкт
                keys.reduce<Record<Key, KeyEntity['count']> | {}>(
                    (acc, key) => ({ ...acc, [key]: (acc[key] || 0) + 1 }),
                    {},
                )
            ),
        ).subscribe(async (keys: KeyMapDTO) => {
            await this.appService.updateKeysData(keys); // спочатку зберігаємо в DB, але якщо дані не критичні, то можна одразу сповіщати юзерів
            this.broadcastToClients(keys);
        })
    }

    handleDisconnect(socket: Socket) {
        this.connections.delete(socket);
    }

    handleConnection(client: Socket) {
        this.connections.add(client);
    }

    private broadcastToClients(data: KeyMapDTO) {
        this.server.emit('keys_updated', data);
    }

    @SubscribeMessage('key_pressed')
    handleEvent(@MessageBody() key: Key): void {
        this.keyEvent$.next(key);
    }
}
