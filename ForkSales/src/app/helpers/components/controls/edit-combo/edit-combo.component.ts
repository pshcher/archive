import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditComboComponent),
    multi: true
};

@Component({
    selector: 'app-edit-combo',
    templateUrl: './edit-combo.component.html',
    styleUrls: ['./edit-combo.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class EditComboComponent implements ControlValueAccessor {

    //The internal data model
    private innerValue: any = '';

    @Input() collectionIn;
    @Input() req;
 
    value: string;
    toggleDD: boolean = true;
    textboxValue: string;
    selectedDDValue: string;

    // Method that is invoked on an update of a model.
    updateChanges() {
        this.value = this.toggleDD ? this.selectedDDValue : this.textboxValue;
        console.log("updateChanges: " +  this.value);
        this.onChangeCallback(this.value);
    }

    get isValid(){
        return ( this.value && this.value.length > 0 );
    }
    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.value = value;
        this.updateChanges();
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    diags(o) {
        return JSON.stringify(o);
    }
}

