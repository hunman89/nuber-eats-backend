import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver()
export class RestaurnatsResolver {
  @Query((returns) => Restaurant)
  myRestaurant() {
    return true;
  }
}
