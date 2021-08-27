import {Component,OnInit,ChangeDetectorRef,HostListener,} from '@angular/core';
import {FormGroup,FormBuilder,ValidationErrors,Validators} from '@angular/forms';
import { Subscription} from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import {parseToObjectOtherObject,numberOnly,toFailedStep} from 'src/app/_helpers/tools/validator.tool';
import { COUNTRIES } from 'src/app/_helpers/tools/countrys.tools';
import {ADD_ASSISTANT,error_messages} from 'src/app/_helpers/objects/forms.objects';
import { MainService } from 'src/app/modules/_services/main.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-assistant',
  templateUrl: './add-assistant.component.html',
  styleUrls: ['./add-assistant.component.css'],
})
export class AddAssistantComponent implements OnInit {
  public assistant: any = null; //REACTIVE FORM
  public minDate: Date;
  public maxDate: Date;
  public assistantForm: FormGroup;
  public documentTypes = ['CC', 'TI', 'CE'];
  public churchTypes: { [key: string]: string }[] = [];
  public cities: { [key: string]: string }[] = [];
  public countries: { [key: string]: any }[] = [];
  public places: { [key: string]: string }[] = [];
  public placesObject: { [key: string]: any } = null; // FOR OBTAIN PLACES OBJECTS - NOT ID
  public pastors: { [key: string]: string }[] = [];
  public pastorsObject: { [key: string]: any } = null; //FOR OBTAIN PASTORS OBJECT - NOT CODE
  public leaders: { [key: string]: string }[] = [];
  public leadersObject: { [key: string]: any } = null; //FOR OBTAIN LEADER OBJECT - NOT ID
  public step: number = 0;
  public isMobile: boolean = false;
  private unsubscribe: Subscription[] = [];
  public disableds = [false, true, true, true];
  public disabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    public dialog: MatDialogRef<AddAssistantComponent>,
    private cdr: ChangeDetectorRef
  ) {
    this.minDate = new Date(1950, 0, 1);
    this.maxDate = new Date(new Date().getFullYear() - 5, 0, 1);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getChurchTypes();
    this.getCountries();
  }
  //validamos que solo se escriban numeros en input
  numberOnly($event): boolean {
    return numberOnly($event);
  }

  // creamos el formulario para diligenciar los campos y su estructura se encuentra en ADD_ASSISTANT conjunto a los validators
  buildForm() {
    this.assistantForm = this.fb.group(ADD_ASSISTANT);
  }

  get form() {
    return this.assistantForm.controls;
  }

  //metodo para validar si el estamos en mobile o desktop
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth <= 550) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  // optenemos los tipos de iglesias por el servicio de mainService
  getChurchTypes() {
    const getChurchTypesSubcr = this.mainService
      .getChurchTypes()
      .subscribe((res: any) => {
        this.churchTypes = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getChurchTypesSubcr);
  }
  // construimos las el array de las ciudades que estan en COUNTRIES
  getCountries() {
    if (this.countries.length == 0) {
      this.countries = COUNTRIES || [];
    }
  }

  getPlaces(): void {
    //SEDES OR CHUCHES
    const filter =
      this.assistantForm.get('country').value == 'Colombia'
        ? 'national'
        : 'international';
    const getPlacesSubscr = this.mainService
      .getPlaces({ type: filter })
      .subscribe(
        async (res) => {
          this.placesObject = await parseToObjectOtherObject(res, 'id');
          this.places = res || [];
          this.cdr.detectChanges();
        },
        (err) => {
          throw err;
        }
      );
    // reiniciamos los valores de los pastores si se cambian los internacionales o los nacionales
    this.unsubscribe.push(getPlacesSubscr);
    this.assistantForm.get('headquarters').reset();
    this.assistantForm.get('network').reset();
    this.assistantForm.get('churchName').reset();
    this.assistantForm.get('pastor').reset();
    this.assistantForm.get('leader').reset();
    this.pastors = [];
    this.leaders = [];
  }

  // consultamos los pastores por el tipo de iglesia seleccionado
  getPastors() {
    this.pastors = [];
    if (this.form.network.value && this.form.headquarters.value) {
      const getCivilSubscr = this.mainService
        .getLeadersOrPastors({
          Code: this.form.network.value,
          IdSede: parseInt(this.form.headquarters.value),
        })
        .subscribe(async (res: any) => {
          this.pastorsObject = await parseToObjectOtherObject(res, 'user_code');
          this.pastors = res || [];
          this.form.pastor.enable();
          this.cdr.detectChanges();
        });
      this.unsubscribe.push(getCivilSubscr);
    }
  }

  // consultamos los lideres segun el pastor 
  getLeaders(Code: string) {
    this.leaders = [];
    const getLeadersSubscr = this.mainService
      .getLeadersOrPastors({
        Code,
        IdSede: parseInt(this.form.headquarters.value),
      })
      .subscribe(async (res: any) => {
        console.log('LEADERS OR PASTORS', res);
        this.leadersObject = await parseToObjectOtherObject(res, 'id');
        this.leaders = res || [];
        this.form.leader.enable();
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }


  submit() {
    if (this.assistantForm.invalid) {
      this.setStep(toFailedStep(this.form));
      return;
    }
    let pastor,
      leader,
      church: any = null;
    if (this.form.typeChurch.value == '88') {
      //IN CASE OF SELECTED MCI CHURCHES
      pastor = this.pastorsObject[this.form.pastor.value];
      leader = this.leadersObject[this.form.leader.value];
      church = this.placesObject[this.form.headquarters.value];
    } else {
      // IN CASE OF SELECTED church g12 and other
      pastor = { name: this.form.pastorName.value };
      leader = { name: 'NO APLICA, NO IGLESIA MCI' };
      church = { name: this.form.churchName.value };
    }
    let country = this.form.country.value;
    if (!country) this.form.country.setValue('colombia');

    this.dialog.close({
      ...this.assistantForm.getRawValue(),
      ...{ pastor, leader, church },
    });
  }

  setStep(index: number, init?) {
    this.step = index;
  }

  async nextStep() {
    var disable = this.step + 1;
    var validateSteapForm = this.validateFormErrors(this.step);
    if (validateSteapForm) {
      this.disableds[disable] = false;
      this.step++;
    }
  }

  prevStep() {
    var validateSteapForm = this.validateFormErrors(this.step);
    if (validateSteapForm) {
      this.step--;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  validateFormErrors(validate) {
    let errorText = '';
    if (
      this.step == 1 &&
      this.assistantForm.get('email').value !=
        this.assistantForm.get('confirmEmail').value
    ) {
      errorText = '- La confirmacion de correo no coincide';
    }
    console.log('errorsss', this.assistantForm.controls);
    Object.keys(this.assistantForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors =
        this.assistantForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          if (error_messages[validate][key]) {
            error_messages[validate][key].map((res) => {
              if (res.type == keyError)
                errorText = `${errorText} <br>- ${res.message}`;
            });
          }
        });
      }
    });
    if (errorText != '') {
      setTimeout(() => {
        Swal.fire('Verifique los siguientes datos:', errorText, 'error');
      }, 500);
      return false;
    } else {
      return true;
    }
  }
}
