import { Validators } from '@angular/forms';

export const ADD_ASSISTANT = {
  event: [null],
  registerType: ['1'],
  confirmEmail: [null],
  documentNumber: [
    null,
    [
      Validators.required,
      Validators.pattern(/^[0-9a-zA-Z\s,-]+$/),
      Validators.minLength(6),
      Validators.maxLength(13),
    ],
  ],
  name: ['', [Validators.required]], //
  lastName: ['', [Validators.required]],
  gender: [null, [Validators.required]], //
  dateBirth: [null, []], //
  mobile: [''], //
  email: ['', [Validators.email, Validators.required]], //
  country: [null, Validators.required],
  address: [
    '',
    [
      Validators.pattern(/^[#.0-9a-zA-Z\s,-]+$/),
      Validators.maxLength(50),
      Validators.minLength(8),
    ],
  ], //
  typeChurch: [null, [Validators.required]],
  headquarters: [null], //sede
  network: [null], //red
  pastor: [{ value: '', disabled: true }],
  leader: [{ value: '', disabled: true }], //
  churchName: [null], //case church g12 and other
  pastorName: [null], //case church g12 and other
  terms: [null],
  politics: [null],
  documentType: [null],
  language: [null, Validators.required],
  have_translator: [false, null],
  is_translator: [false, null],
  translator: [0, null]
};

export const NEW_DONATION = {
  financialInstitutionCode: [null, [Validators.required]], //BANK
  clientType: [null, [Validators.required]], //PERSON TYPE
  paymentType: [null], //PSE,TC,PE
  orderType: ['Donacion'],
  documentType: ['CC'],
  paymentMethod: [null, [Validators.required]], // PSE,TC,PE
  amount: [{ value: null, disabled: true }], //PRICE OF EVENT
  cardInstallmentsNumber: [15],
  cardNumber: [null, [Validators.required]],
  cardName: [null, [Validators.required]],
  cardSecurityCode: [null, [Validators.required]],
  cardExpirationDate: [null, [Validators.required]],
  cardMonth: [null, [Validators.required]],
  cardYear: [null, [Validators.required]],
  document: [
    null,
    [
      Validators.pattern(/^[0-9a-zA-Z\s,-]+$/),
      Validators.minLength(6),
      Validators.required,
      Validators.maxLength(13),
    ],
  ],
  name: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  contactPhone: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[0-9+]*$/),
      Validators.maxLength(10),
      Validators.minLength(6),
    ],
  ],
  paymentCode: [null, [Validators.required]],
  paymentPaypal: [null, []],
  ipAddress: [null],
  address: [],
  returnUrl: [''], // PENDING
  pastor: [''],
  leader: [''],
  postalCode: [''],
  country: [''],
  currency: [''],
  is_translator: [false, null],
  translator: [0, null],
  subTotal: [0, null]
};

export const donation_errors = {
  // validadores de informacion personal
  personal_information: {
    documentType: [
      { type: 'required', message: 'Tipo de documento requerido' },
    ],
    document: [
      { type: 'required', message: 'Numero de documento requerido' },
      {
        type: 'pattern',
        message: 'El documento no puede tener caracteres especiales',
      },
      {
        type: 'minlength',
        message: 'El documento debe tener mas de 6 d??gitos',
      },
      {
        type: 'maxlength',
        message: 'El documento debe tener menos de 13 d??gitos',
      },
    ],
    name: [{ type: 'required', message: 'Nombre requerido' }],
    lastName: [{ type: 'required', message: 'Apellido requerido' }],
    confirmEmail: [{ type: 'required', message: 'Confirmar el correo' }],
    email: [
      { type: 'required', message: 'Correo requerido' },
      { type: 'email', message: 'Correo no identificado' },
    ],
    contactPhone: [
      { type: 'required', message: 'Numero celular requerido' },
      {
        type: 'pattern',
        message: 'El celular no puede tener caracteres especiales o letras',
      },
      { type: 'minlength', message: 'El  celular debe tener mas de 6 d??gitos' },
      {
        type: 'maxlength',
        message: 'El celular debe tener menos de 10 d??gitos',
      },
    ],
  },
  // validadores de metodo de pago seleccionado
  // 1 tarjeta de credito
  // 2 pse
  // 3 transferencia bancaria payu
  // 4 redimir codigo
  // 5 pago por paypal

  1: {
    cardNumber: [{ type: 'required', message: 'Escribe numero de tarjeta' }],
    cardName: [{ type: 'required', message: 'Ecribe nombre de tarjeta' }],
    cardSecurityCode: [
      { type: 'required', message: 'Escribe codigo de seguridad' },
    ],
    cardMonth: [{ type: 'required', message: 'Escribe mes de vencimiento' }],
    cardYear: [{ type: 'required', message: 'Escribe a??o de vencimiento' }],
  },
  2: {
    financialInstitutionCode: [
      { type: 'required', message: 'Selecciona un banco' },
    ],
    clientType: [{ type: 'required', message: 'Selecciona tipo de persona' }],
  },
  3: {
    paymentMethod: [
      { type: 'required', message: 'Selecciona un metodo de pago' },
    ],
  },
  4: {
    paymentCode: [{ type: 'required', message: 'Escribe un codigo' }],
  },
  5: {
    paymentPaypal: [
      { type: 'required', message: 'Escribe el correo de paypal' },
      { type: 'email', message: 'Correo de paypal no identificado' },
    ],
  },
  6: {},
  // "PSE": "PSE",
  // "Cr??dito": "TC",
  // "Efectivo": "PE"
};

export const error_messages = [
  {
    documentNumber: [
      { type: 'required', message: 'Numero de documento requerido' },
      {
        type: 'pattern',
        message: 'El documento no puede tener caracteres especiales',
      },
      {
        type: 'minlength',
        message: 'El documento debe tener mas de 6 d??gitos',
      },
      {
        type: 'maxlength',
        message: 'El documento debe tener menos de 13 d??gitos',
      },
    ],
    documentType: [
      { type: 'required', message: 'Tipo de documento requerido' },
    ],
    name: [{ type: 'required', message: 'Nombre requerido' }],
    lastName: [{ type: 'required', message: 'Apellido requerido' }],
    gender: [{ type: 'required', message: 'Genero Requerido' }],
    dateBirth: [{ type: 'required', message: 'Fecha de nacimiento requerida' }],
  },

  {
    mobile: [
      { type: 'required', message: 'Numero celular requerido' },
      {
        type: 'pattern',
        message: 'El celular no puede tener caracteres especiales o letras',
      },
      {
        type: 'minlength',
        message:
          'El celular no tiene el minimo de digitos especificados por el pais',
      },
      {
        type: 'maxlength',
        message:
          'El celular no tiene el maximo de digitos especificado por el pais',
      },
    ],

    email: [
      { type: 'required', message: 'Correo requerido' },
      { type: 'email', message: 'Correo no identificado' },
    ],
    // 'city': [{ type: 'required', message: 'Ciudad requerida' }],
    address: [
      {
        type: 'pattern',
        message: 'No puedes poner caracteres que no sean una direcci??n',
      },
      {
        type: 'maxlength',
        message: 'La direcci??n no puede tener mas de 50 caracteres',
      },
      {
        type: 'minlength',
        message: 'La direcci??n no puede tener menos de 8 caracteres',
      },
    ],
    language: [{ type: 'required', message: 'Lenguaje requerido' }],
  },
  {
    typeChurch: [{ type: 'required', message: 'Selecciona una iglesia' }],
    pastor: [{ type: 'required', message: 'Selecciona un pastor' }],
    leader: [{ type: 'required', message: 'Selecciona un lider' }],
    churchName: [
      { type: 'required', message: 'Escribe el nombre de la iglesa' },
    ],
    pastorName: [{ type: 'required', message: 'Escribe el nombre del pastor' }],
    network: [{ type: 'required', message: 'Selecciona una red' }],
    headquarters: [{ type: 'required', message: 'Selecciona una sede' }],
    country: [{ type: 'required', message: 'Selecciona un pais' }],
  },
];
