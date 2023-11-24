import { Order } from 'src/utils/entities';
import { PaymentStatus } from 'src/utils/enums';

export function choosePaymentStatus(order: Order, event: string) {
  switch (event) {
    case 'payment_intent.succeeded':
      order.paymentStatus = PaymentStatus.Succeded;
      break;

    case 'payment_intent.processing':
      order.paymentStatus = PaymentStatus.Processing;
      break;

    case 'payment_intent.payment_failed':
      order.paymentStatus = PaymentStatus.Failed;
      break;

    default:
      order.paymentStatus = PaymentStatus.Created;
      break;
  }

  return order;
}
