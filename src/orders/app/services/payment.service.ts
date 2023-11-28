import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Stripe } from 'stripe';
import { env } from 'src/utils/env';
import { InjectStripe } from 'nestjs-stripe';

@Injectable()
export class StripeService {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

  async createPaymentIntent(
    orderId: string,
    totalAmount: number,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: Number(totalAmount),
        currency: env.STRIPE_CURRENCY as string,
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
