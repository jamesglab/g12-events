import { getJSONPaymentType } from './validator.tool';
import { environment } from '../../../environments/environment';
import { PyloadPayment } from '../models/payload_paymnet.model';
// creamos el metodo de pago
const PAYMENT_TYPE = {
  '1': 'TC',
  '2': 'PSE',
  '3': 'PE',
  '4': 'CODE',
  '5': 'PAYPAL',
  '6': 'BOX',

};

export const insertPayment = async (
  formFields,
  event: any,
  assistants: any[]
) => {
  formFields.paymentType = PAYMENT_TYPE[formFields.paymentType];
  //////////// formFields contiene los datos de todo el fomrulario
  ////////////event contiene los datos del evento
  //////////// asistant contiente los asistentes del evento
  const payload: PyloadPayment = await {
    event_information: {
      event,
      financial_cut: event.financialCutSelected,
      quantity_tickets: assistants.length,
    },
    donor_information: {
      identification: formFields.document,
      email: formFields.email,
      name: formFields.name,
      last_name: formFields.lastName,
      phone: formFields.contactPhone,
      country: formFields.country,
      document_type: formFields.documentType,
      address : formFields.address
    },
    payment_information: await getJSONPaymentType(
      formFields,
      event.name,
      assistants.length
    ),
    assistants_information: assistants,
  };
  // asignamos el tipo de pago

  //   // construimos el objeto y de pago y de usuario donante
  //   let JSON_payment = getJSONPaymentType(
  //     formFields,
  //     event.name,
  //     assistants.length
  //   );
  //   // creamos los assistentes
  //   JSON_payment.usersList = assistants;
  //   // enviamos la plataforma
  //   JSON_payment.platform = 'EVENTOSG12';
  //   // la url response que necesita el backend en casos como pse
  //   JSON_payment.urlResponse = environment.urlResponse;
  //   // anexamos el evento a el campo donacion
  //   JSON_payment.donation = event;
  //   // enviamos el corte que selecciono el usuario del evento
  //   JSON_payment.financialCut = event.financialCutSelected;

  //   let payload : PyloadPayment= {
  //     event_information : event,
  //     donor_information :
  //   };

  return payload;
};
