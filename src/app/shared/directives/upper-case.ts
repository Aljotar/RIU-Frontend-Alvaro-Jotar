import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appUpperCase]',
})
export class UpperCase {
  @HostListener('input',['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const upper = input.value.toUpperCase();

    if(input.value !== upper) {
      input.value = upper;
      input.setSelectionRange(start,end);
      input.dispatchEvent(new Event('input',{ bubbles: true }));
    }


  }

}
