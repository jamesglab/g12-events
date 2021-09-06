import { getJSONPaymentType } from './validator.tool';
import { environment } from '../../../environments/environment';
// creamos el metodo de pago
const PAYMENT_TYPE = {
    "1": "TC",
    "2": "PSE",
    "3": "PE",
    "4": "CODE",
    "5": "PAYPAL"

}

export const insertPayment = (formFields, event: any, assistants: any[]) => {
    //////////// formFields contiene los datos de todo el fomrulario
    ////////////event contiene los datos del evento 
    //////////// asistant contiente los asistentes del evento 


    // asignamos el tipo de pago
    formFields.paymentType = PAYMENT_TYPE[formFields.paymentType];
    // construimos el objeto y de pago y de usuario donante
    let JSON_payment = getJSONPaymentType(formFields, event.name, assistants.length);
    // creamos los assistentes 
    JSON_payment.usersList = assistants;
    // enviamos la plataforma
    JSON_payment.platform = "EVENTOSG12";
    // la url response que necesita el backend en casos como pse
    JSON_payment.urlResponse = environment.urlResponse;
    // anexamos el evento a el campo donacion
    JSON_payment.donation = event;
    // enviamos el corte que selecciono el usuario del evento 
    JSON_payment.financialCut = event.financialCut[event.financialCutSelected];
    return JSON_payment;
}