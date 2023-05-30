import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appdecimalrangevalidator]'
})
export class DecimaRangeValidatorDirective {

    @Input() MinValue: number;
    @Input() MaxValue: number;
    @Input() MaxAllowed:number;
    private regex: RegExp;

    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

    constructor(private el: ElementRef) {
    }
    ngOnInit() {
        // Allow decimal numbers and negative values
        this.regex = new RegExp(`^-?\\d{${this.MinValue},${this.MaxValue}}(\\.\\d{0,${this.MaxAllowed}})?$`);
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
}