import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'sm' | 'md';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
  }],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  readonly placeholder = input('');
  readonly type = input('text');
  readonly readonly = input(false);
  readonly size = input<InputSize>('md');

  innerValue = '';
  isDisabled = false;

  onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void { this.innerValue = val ?? ''; }
  registerOnChange(fn: (val: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled = isDisabled; }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.innerValue = val;
    this.onChange(val);
  }
}
