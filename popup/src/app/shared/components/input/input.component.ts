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
  @Input() public label: string = '';
  @Input() public placeholder: string = '';
  @Input() public disabled: boolean = false;
  public value = '';

  private touched = false;
  private disabledInner = false;

  onChange = (val: string) => {};

  onTouched = () => {};

  updateValue(val: string) {
    this.onChange(val);
  }

  writeValue(val: string) {
    this.value = val;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabledInner = disabled;
  }
}
