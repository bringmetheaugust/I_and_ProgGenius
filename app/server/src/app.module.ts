import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyEntity } from './app.entity';
import AppGateway from './app.geteway';

@Module({
    imports: [
        TypeOrmModule.forFeature([KeyEntity]),
        TypeOrmModule.forRoot({
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            host: process.env.DB_HOST,
            port: 5432,
            database: process.env.DB_NAME,
            type: 'postgres',
            synchronize: true,
            autoLoadEntities: true,
            name: 'default',
        }),
    ],
    controllers: [AppController],
    providers: [AppService, AppGateway],
})
export class AppModule { }
