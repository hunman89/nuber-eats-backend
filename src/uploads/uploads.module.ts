import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadsController } from './uploads.controller';

@Module({ controllers: [UploadsController], imports: [ConfigModule.forRoot()] })
export class UploadsModule {}
