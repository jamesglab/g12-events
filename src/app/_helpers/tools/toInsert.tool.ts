import { getJSONPaymentType, getIpAddress } from './validator.tool';

const PAYMENT_TYPE = {
    "PSE": "PSE",
    "Crédito": "TC",
    "Efectivo": "PE"
}

export const insertPayment = (formFields, event: any, assistants: number) => {
    formFields.paymentType = PAYMENT_TYPE[formFields.paymentType];
    let JSON_payment = getJSONPaymentType(formFields, event.name, assistants);
    JSON_payment.platform = "EVENTOSG12";
    JSON_payment.urlResponse = "https://mci.eventosg12.com/transaction";
    JSON_payment.donation = event.id;
    return JSON_payment;
}