import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export type SelectSize = 'sm' | 'md';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements ControlValueAccessor {
  readonly size = input<SelectSize>('md');

  innerValue: any = '';
  isDisabled = false;

  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: any): void { this.innerValue = val ?? ''; }
  registerOnChange(fn: (val: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled = isDisabled; }

  handleChange(val: any): void {
    this.innerValue = val;
    this.onChange(val);
  }
}
