import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;

  value = '';

  onChange = (val: string) => {};

  onTouched = () => {};

  updateValue(val: string) {
    this.onChange(val);
  }

  writeValue(val: string) {
    console.log('from intpu', val);
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
