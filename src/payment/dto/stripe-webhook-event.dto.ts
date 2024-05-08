export class StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}