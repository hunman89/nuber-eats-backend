import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repositories';
import {
  CategoryResolver,
  DishResolver,
  RestaurnatsResolver,
} from './restaurants.resolvers';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])],
  providers: [
    RestaurnatsResolver,
    CategoryResolver,
    RestaurantService,
    DishResolver,
  ],
})
export class RestaurnatsModule {}
