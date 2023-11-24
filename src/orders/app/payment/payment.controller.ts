import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { Stripe } from 'stripe';

@Controller()
export class PaymentController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('stripe_webhook')
  async webhook(@Body() event: Stripe.Event): Promise<object> {
    await this.ordersService.changePaymentStatus(event);
    return { message: 'success' };
  }
}
