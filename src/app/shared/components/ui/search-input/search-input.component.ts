import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-search-input',
  standalone: true,
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchInputComponent),
    multi: true,
  }],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements ControlValueAccessor {
  readonly placeholder = input('Search...');

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
