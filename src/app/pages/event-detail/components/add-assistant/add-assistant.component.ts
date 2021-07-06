import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { parseToObject, numberOnly, toFailedStep } from 'src/app/_helpers/tools/validator.tool';
import { ADD_ASSISTANT, error_messages } from 'src/app/_helpers/objects/forms.objects';

import { MainService } from 'src/app/modules/_services/main.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-assistant',
  templateUrl: './add-assistant.component.html',
  styleUrls: ['./add-assistant.component.css']
})
export class AddAssistantComponent implements OnInit {

  public assistant: any = null; //REACTIVE FORM
  //FOR MIN & MAX VALIDATION
  public minDate: Date;
  public maxDate: Date;

  public assistantForm: FormGroup;
  // public documentTypes: { [key: string]: string }[] = [];
  public churchTypes: { [key: string]: string }[] = [];
  public cities: { [key: string]: string }[] = [];
  public places: { [key: string]: string }[] = [];
  public pastors: { [key: string]: string }[] = [];
  public pastorsObject: { [key: string]: string } = null; //FOR OBTAIN PASTORS ID - NOT CODE
  public leaders: { [key: string]: string }[] = [];
  public leadersObject: { [key: string]: string } = null; //FOR OBTAIN LEADER ID - NOT CODE
  // public filteredOptions: Observable<any[]>;
  public step: number = 0;
  private unsubscribe: Subscription[] = [];

  public disableds = [false, true, true, true];

  public disabled: boolean = true;

  // error_messages = {
  //   'companyName': [{ type: 'required', message: 'Nombre comercial requerido' },],
  //   'country': [{ type: 'required', message: 'Pais requerido' },],
  //   'city': [{ type: 'required', message: 'Ciudad requerida' }],
  //   'neighborhood': [{ type: 'required', message: 'Barrio/Colonia requerido ' }],
  //   'streetNumber': [{ type: 'required', message: 'Calle y numero requerido' },],
  //   'streetNumber2': [{ type: 'required', message: 'Calle y numero 2 requerido' },],
  //   'postalCode': [{ type: 'required', message: 'Codigo postal requerido' },],
  //   'agencyValidate': [{ type: 'required', message: 'Confirma el comercio' }],
  //   'NIP': [{ type: 'required', message: 'Confirma el  Nº de Identificación Fiscal ' }],
  // };

  constructor(private fb: FormBuilder, private mainService: MainService,
    public dialog: MatDialogRef<AddAssistantComponent>, private cdr: ChangeDetectorRef) {
    this.minDate = new Date(1950, 0, 1);
    this.maxDate = new Date(new Date().getFullYear() - 5, 0, 1);
  }

  ngOnInit(): void {
    this.buildForm();
    // this.getDocumentTypes();
    this.getChurchTypes();
    // this.filteredOptions = this.form.Leader.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value?.name),
    //     map(name => name ? this._filter(name) : this.leaders.slice())
    //   );
  }

  numberOnly($event): boolean { return numberOnly($event); }

  buildForm() { this.assistantForm = this.fb.group(ADD_ASSISTANT)}

  get form() { return this.assistantForm.controls; }

  // getDocumentTypes() {
  //   const getDocumentTypesSubscr = this.mainService
  //     .getDocumentTypes().subscribe((res: any) => {
  //       this.documentTypes = res.entity || [];
  //       this.cdr.detectChanges();
  //     })
  //   this.unsubscribe.push(getDocumentTypesSubscr);
  // }

  getChurchTypes() {
    const getChurchTypesSubcr = this.mainService
      .getChurchTypes().subscribe((res: any) => {
        this.churchTypes = res.entity || [];
        this.cdr.detectChanges();
      })
    this.unsubscribe.push(getChurchTypesSubcr);
  }

  getCities() {
    if (this.cities.length == 0) {
      const getCitiesSubscr = this.mainService
        .getCities().subscribe((res: any) => {
          this.cities = res || [];
          this.cdr.detectChanges();
        })
      this.unsubscribe.push(getCitiesSubscr)
    }
  }

  getPlaces(): void {
    const getPlacesSubscr = this.mainService
      .getPlaces().subscribe((res) => {
        this.places = res;
        this.cdr.detectChanges();
      }, err => { throw err; })
    // const getPlaceSubscr = this.mainService
    //   .getPlaces({ Type: 'NACIONALES' }).subscribe((nationals: any) => {

    //     const getBogSubscr = this.mainService
    //       .getPlaces({ Type: 'BOGOTA' }).subscribe((bogota: any) => {

    //         nationals.entity.push(bogota.entity[0]);
    //         const compare = (a, b) => a.name.localeCompare(b.name);
    //         nationals.entity.sort(compare);

    //         this.places = nationals.entity || [];
    //         this.cdr.detectChanges();
    //       }, err => {
    //         throw err;
    //       });
    //     this.unsubscribe.push(getBogSubscr);
    //   });
    this.unsubscribe.push(getPlacesSubscr);
  }

  getPastors() {
    this.pastors = [];
    if (this.form.network.value && this.form.headquarters.value) {
      const getCivilSubscr = this.mainService
        .getLeadersOrPastors({ Code: this.form.network.value, IdSede: parseInt(this.form.headquarters.value) }).subscribe(async (res: any) => {
          // this.pastorsObject = await parseToObject(res.entity, 'code', 'id');
          this.pastors = res || [];
          this.form.pastor.enable();
          this.cdr.detectChanges();
        });
      this.unsubscribe.push(getCivilSubscr);
    }
  }

  getLeaders(Code: string) {
    this.leaders = [];
    // this.isLoading.leaders = true;
    const getLeadersSubscr = this.mainService
      .getLeadersOrPastors({ Code, IdSede: parseInt(this.form.headquarters.value) }).subscribe(async (res: any) => {
        // this.leadersObject = await parseToObject(res.entity, 'code', 'id');
        this.leaders = res || [];
        // this.isLoading.leaders = false;
        this.form.leader.enable();
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }

  //FOR LEADERS
  // displayFn(leader: any): string { return leader && leader.name ? leader.name : ''; }

  // private _filter(name: string): any[] {
  //   const filterValue = name.toLowerCase();
  //   return this.leaders.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  // }
  ///END FOR LEADERS

  submit() {
    if (this.assistantForm.invalid) {
      this.setStep(toFailedStep(this.form));
      return;
    }
    // this.form.pastor.setValue(this.pastorsObject[this.form.Pastor.value]);
    // this.form.leader.setValue(this.leadersObject[this.form.Leader.value]);
    this.dialog.close(this.assistantForm.getRawValue());
  }

  setStep(index: number, init?) {
    // this.step = index;
    // console.log('steap initS', index)
    // // if (init) {
    // var validateSteapForm = this.validateFormErrors(index);
    // console.log("validate", validateSteapForm)
    // if (validateSteapForm) { 
    this.step = index
    // }

  }

  async nextStep() {
    var disable = this.step + 1;

    var validateSteapForm = this.validateFormErrors(this.step);

    if (validateSteapForm) {
      this.disableds[disable] = false;
      this.step++
    }

  }

  prevStep() {
    var validateSteapForm = this.validateFormErrors(this.step);
    if (validateSteapForm) { this.step-- }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  validateFormErrors(validate) {
    let errorText = '';
    console.log('errorsss', this.assistantForm.controls)
    Object.keys(this.assistantForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.assistantForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (error_messages[validate][key]) {
            error_messages[validate][key].map(res => { if (res.type == keyError) errorText = `${errorText} <br>- ${res.message}`; })
          }
        });
      }
    });
    if (errorText != '') {
      setTimeout(() => {
        Swal.fire('Verifique los siguientes datos:', errorText, 'error');
      }, 500);
      return false
    } else {
      return true;
    }

  }


}
