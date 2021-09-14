import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field((type) => Int)
  @Column()
  transactionId: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.payments)
  user: User;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant)
  restaurant: Restaurant;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}
