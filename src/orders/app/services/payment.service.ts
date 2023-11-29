import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { InjectStripe } from 'nestjs-stripe';

@Injectable()
export class StripeService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private configService: ConfigService,
  ) {}

  async createPaymentIntent(
    orderId: string,
    totalAmount: number,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: Number(totalAmount),
        currency: this.configService.get<string>('STRIPE_CURRENCY'),
        payment_method_types: ['card'],
        metadata: { orderId },
      };

      return await this.stripeClient.paymentIntents.create(paymentIntentParams);
    } catch (error) {
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }
  }
}
