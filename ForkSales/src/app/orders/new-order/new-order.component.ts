import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditComboComponent } from 'src/app/helpers/components/controls/edit-combo/edit-combo.component';
import { OrdersService } from '../orders.service';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgModel } from '@angular/forms';
import { CustomCheckoutComponent } from 'src/app/helpers/components/controls/custom-checkout/custom-checkout.component';

import SampleJson from 'src/assets/SampleJson.json';

export interface User {
  id: number,
  name: string;
}

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  customInputTestValue;
  emailinp;

  ccAuthFormOpen = false;
  model = { ffood: '' };
  streetsData = ['qwerty123', 'bob my uncle'];
  streetToggleState: boolean = false;
  ext;
  @ViewChild('streets') private streetsComponent: EditComboComponent;
  selectedStreet: string = "";
  @ViewChild('checkOut') private customCheckoutComponent: CustomCheckoutComponent;
  
  options: string[] = ['One', 'Two', 'Three'];
  selectedOption = "Two";

  options2: string[] = ['One', 'Two', 'Three'];
  selectedOption2 = "Three";

  options3: User[] = [
    { id: 1, name: 'Mary' },
    { id: 2, name: 'Shelley' },
    { id: 3, name: 'Igor' }
  ];

  selectedOption3 = this.options3[0];
  @ViewChild('fltrcombo') fltrcombo: NgModel;

  private subject = new Subject<User>();
  _selectedOption4 = this.options3[0];
  get selectedOption4() {
    return this._selectedOption4;
  }
  set selectedOption4(val) {
    console.log('SO4: ' + typeof val);
    let newVal: User = <User>{};
    if (typeof val == 'string' || val instanceof String) {

      this._selectedOption4 = val;
      this.subject.next(val);

    }
    else {
      newVal = val;

      this._selectedOption4 = newVal;
      this.subject.next(newVal);
    }
  }

  onBlur() {
    var t1 = '';

    if (this.selectedOption4.id) {
      t1 = this.selectedOption4.name.trim();

      if (t1.length == 0)
        this.selectedOption4 = <User>{ id: null, name: '' };
      else
        this.selectedOption4 = <User>{ id: this.selectedOption4.id, name: t1 };
    }
    else {
      t1 = this.selectedOption4.toString().trim();
      if ( !t1 )
        this.selectedOption4 = null;
    }
  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  filteredOptions: Observable<User[]>;

  ngOnInit() {
    this.filteredOptions = this.subject.asObservable().pipe(
      startWith(''), //may not need this, as we check each value in filter f()
      map(value => this._filter(value))
    );
  }

  private _filter(value: any): User[] {
    if (value && value.id) {
      let filterValue = '';
      // if (value.name != undefined)
      filterValue = value.name.trim().toLowerCase();
      // else
      //   filterValue = value.trim().toLowerCase();
      return this.options3.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    else
      return this.options3;
  }

  openAuthForm() {
    this.router.navigate(["admin"]);
  }

  constructor(private router: Router, private route: ActivatedRoute, private ordersService: OrdersService) {
    console.log(SampleJson);
    console.log( "Paul Post Value :" + SampleJson.Post);
   }
  get diagnostic() { return JSON.stringify(this.model); }
  diagnostic2(o) { return JSON.stringify(o); }

  get geterror() {
    return this.model && this.model.ffood === '111';
  }

  onSubmit() {
  }

  doHTTP() {
    this.ordersService.getOrders().subscribe();
  }
}
