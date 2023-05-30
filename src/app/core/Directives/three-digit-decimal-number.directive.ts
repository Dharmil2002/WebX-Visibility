import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appThreeDigitDecimalNumber]'
})
export class ThreeDigitDecimalNumberDirective {

  @Input() MinValue: number;
  @Input() MaxValue: number;
  private regex: RegExp;

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    // Allow decimal numbers and negative values
    this.regex = new RegExp(`^-?\\d{${this.MinValue},${this.MaxValue}}(\\.\\d{0,3})?$`);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    if (value && !String(value).match(this.regex)) {
      this.el.nativeElement.value = '';
    }
  }
}
