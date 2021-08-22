import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repositories';
import { CategoryResolver, RestaurnatsResolver } from './restaurants.resolvers';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
  providers: [RestaurnatsResolver, CategoryResolver, RestaurantService],
})
export class RestaurnatsModule {}
