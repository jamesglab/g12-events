import { environment } from 'src/environments/environment';
import { PaymentInformation } from '../models/payload_paymnet.model';

export const parseToObject = (
  array: any[],
  key: string,
  value: string
): Promise<{ [key: string]: string }> => {
  return new Promise(async (resolve, reject) => {
    let object = {};
    const iterateArray = async () => {
      return Promise.all(
        array.map((item) => {
          object[item[key]] = item[value];
          return Promise.resolve('ok');
        })
      );
    };
    await iterateArray();
    resolve(object);
  });
};

export const parseToObjectOtherObject = (
  array: any[],
  key: string
): Promise<{ [key: string]: any }> => {
  return new Promise(async (resolve, reject) => {
    let object = {};
    const iterateArray = async () => {
      return Promise.all(
        array.map((item) => {
          object[item[key]] = item;
          return Promise.resolve('ok');
        })
      );
    };
    await iterateArray();
    resolve(object);
  });
};

export const numberOnly = (event): boolean => {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
};

const getStep = (controlName: string): number => {
  let controls = [
    [
      'documentType',
      'DocumentNumber',
      'Name',
      'LastName',
      'Gender',
      'DateBirth',
    ], //POSITION 0 -> STEP 0
    ['Movile', 'Email', 'City'], // POSITION 1 -> STEP 1
    [
      'TypeChurch',
      'Headquarters',
      'Pastor',
      'Leader',
      'ChurchName',
      'PastorName',
    ], // POSITION 2 -> STEP 2
    ['terms'], //POSITION 3 -> STEP 3
  ];
  let _step: number = 0; // step of material
  controls.map((step, i) => {
    // for obtain index of aoa
    step.map((control) => {
      if (control.toLowerCase() === controlName.toLowerCase()) {
        _step = i;
      }
    });
  });
  return _step;
};
// FOR GET CONTROL NAME AND OBTAIN THEM POSITION
export const toFailedStep = (controls: any): number => {
  let step = 0;
  for (let i in controls) {
    if (controls[i].errors) {
      step = getStep(i);
    }
  }
  return step;
};

export const validateCardFlag = (number: string) => {
  let firstTwo = number.length > 2 ? number[0] + number[1] : '';
  if (parseInt(firstTwo) == 34 || parseInt(firstTwo) == 37) {
    return 'AMERICAN';
  } else if (parseInt(firstTwo) >= 40 && parseInt(firstTwo) <= 49) {
    return 'VISA';
  } else if (parseInt(firstTwo) >= 51 && parseInt(firstTwo) <= 55) {
    return 'MASTERCARD';
  } else {
    return null;
  }
};

export const getJSONPaymentType = (
  formFields,
  eventName: string,
  assistants: number
): PaymentInformation => {
  let response: PaymentInformation = {
    amount: parseInt(formFields.amount),
    currency: formFields.currency.toUpperCase(),
    payment_type: '',
    url_response: environment.urlResponse,
    platform: 'EVENTOSG12',
  };

  switch (formFields.paymentType) {
    case 'PSE': {
      response['bank'] = formFields.financialInstitutionCode;
      response['type_person'] = formFields.clientType;
      response.payment_type = 'PSE';
      break;
    }
    case 'TC': {
      response['amount'] =
        formFields.currency.toLowerCase() == 'cop'
          ? parseInt(formFields.amount)
          : parseInt(formFields.amount) * 100;
      response['card_name'] = formFields.cardName;
      response['card_number'] = formFields.cardNumber;
      response['year'] = formFields.cardYear;
      response['month'] = formFields.cardMonth;
      response['cvc'] = formFields.cardSecurityCode;
      response.payment_type =
        formFields.currency.toLowerCase() == 'cop'
          ? 'EPAYCO_CREDIT'
          : 'STRIPE_CREDIT';
      break;
    }
    case 'PE': {
      response['add_days'] = 1;
      response['payment_type'] = 'CASH';
      response['point_payment'] = formFields.paymentMethod;
      break;
    }
    case 'CODE': {
      response['code'] = formFields.paymentCode;
      response.payment_type = 'CODE';
      break;
    }
    case 'PAYPAL': {
      response.payment_type = 'PAYPAL';
      break;
    }
    case 'BOX': {
      response.payment_type = 'BOX';
      break;
    }
  }

  return response;
};
