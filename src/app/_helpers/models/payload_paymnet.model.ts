export class PyloadPayment {
  event_information: EventModel;
  donor_information: userModel;
  payment_information: PaymentInformation;
  assistants_information: AssistantUser[];
}

export class EventModel {
  public event: DonationModel;
  public quantity_tickets: number;
  public financial_cut: ReadFinancialCut;
}

export class ReadFinancialCut {
  public id: number;
  public name: string;
  public prices: {};
  public date_init: Date;
  public date_finish: Date;
  public quantity: number;
  public availability: number;
  public created_at: Date;
  public updated_at: Date;
  public donation_id: DonationModel & number;
  public is_active: boolean;
  public quantity_register_max: number;
  public quantity_register_min: number;
  public is_group: boolean;
  public price_group: {};
  public description: string;
  public massive_pay: boolean;
}

export class PaymentInformation {
  currency: string;
  amount: number;
  bank?: string;
  type_person?: string;
  payment_type: string;
  point_payment?: string;
  add_days?: number;
  code ? : string;
}

export class Cash {
  currency: string;
  amount: number;
  point_payment: string;
  add_days: number;
  payment_type: string;
}

export class Card {
  currency: string;
  amount: number;
  card_name: string;
  card_number: string;
  cvc: string;
  month: string;
  year: string;
  payment_type: string;
}
export class Paypal {
  payment_type: string;
  currency: string;
  amount: number;
}

export class Code {
  currency: string;
  amount: number;
  code: string;
  payment_type: string;
}

export class AssistantUser {
  country: string;
  identification: string;
  document_type: string;
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  email: string;
  confirm_email: string;
  id: number;
  leader: userModel;
  pastor: userModel;
  church: ChurchModel;
  type_church: string;
}

export class ChurchModel {
  public id: number;
  public type: string;
  public denomination: string;
  public country: string;
  public city: string;
  public address: string;
  public location: string;
  public phone: string;
  public capacity: string;
  public services: string[];
  public description: Date;
  public leaders: string[];
  public status: boolean;
  public name: string;
  public created_at: Date;
  public updated_at: Date;
}

export class DonationModel {
  public id: number;
  public type: string;
  public category: string;
  public name: string;
  public description: string;
  public image: string & ImageDonationModel;
  public prices: {};
  public limit: number;
  public location: number;
  public visibility: string[];
  public created_at: Date;
  public updated_at: Date;
  public status: boolean;
  public init_date: Date;
  public finish_date: Date;
  public user_updated: number;
  public massive_pay: boolean;
}

export class ImageDonationModel {
  public url: string;
  public code: string;
}

export class userModel {
  public identification: string;
  public name: string;
  public last_name: string;
  public email: string;
  public phone: string;
  public country: string;
  public document_type: string;
  public address: string;
}
