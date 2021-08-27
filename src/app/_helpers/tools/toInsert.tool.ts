import { getJSONPaymentType, getIpAddress } from './validator.tool';
import { environment } from '../../../environments/environment';
const PAYMENT_TYPE = {
    "1": "TC",
    "2": "PSE",
    "3": "PE"
}

export const insertPayment = (formFields, event: any, assistants: any[]) => {
    // console.log('asistants', assistants)
    formFields.paymentType = PAYMENT_TYPE[formFields.paymentType];
    let JSON_payment = getJSONPaymentType(formFields, event.name, assistants.length);
    JSON_payment.usersList = assistants;
    JSON_payment.platform = "EVENTOSG12";
    JSON_payment.urlResponse = environment.urlResponse;
    JSON_payment.donation = event;
    JSON_payment.financialCut = event.financialCut[event.financialCutSelected];
    return JSON_payment;
}