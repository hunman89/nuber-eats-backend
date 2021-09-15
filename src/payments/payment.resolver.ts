import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentOutyput } from './dtos/get-payments.dto';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver((of) => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation((returns) => CreatePaymentOutput)
  @Role(['Owner'])
  createPayment(
    @AuthUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }

  @Query((returns) => GetPaymentOutyput)
  @Role(['Owner'])
  getPayments(@AuthUser() user: User): Promise<GetPaymentOutyput> {
    return this.paymentService.getPatments(user);
  }
}
