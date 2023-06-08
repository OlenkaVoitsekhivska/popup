import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';

  value = false;

  onChange = (val: boolean) => {};

  onTouched = () => {};

  updateValue(val: boolean) {
    console.log('updating checkbox value', val);
    this.onChange(val);
  }

  writeValue(val: boolean) {
    console.log('from checkbox', val);
    this.value = val;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    // if (!this.touched) {
    //   this.onTouched();
    //   this.touched = true;
    // }
    console.log();
  }

  setDisabledState(disabled: boolean) {
    // this.disabled = disabled;
    console.log();
  }
}
