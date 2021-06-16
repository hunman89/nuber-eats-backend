import { Module } from '@nestjs/common';
import { RestaurnatsResolver } from './restaurants.resolvers';

@Module({
  providers: [RestaurnatsResolver],
})
export class RestaurnatsModule {}
