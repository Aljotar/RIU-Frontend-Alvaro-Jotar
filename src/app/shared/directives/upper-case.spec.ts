import { Component } from "@angular/core";
import { UpperCase } from './upper-case'
import { ComponentFixture, TestBed } from "@angular/core/testing";



@Component({
    standalone: true,
    imports: [UpperCase],
    template: `<input appUpperCase />`,
})
class HostComponent {}

describe('UpperCase',() =>{
    let fixture: ComponentFixture<HostComponent>;
    let input: HTMLInputElement;

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input');
    })

    it('should keep value when it is already uppercase', () =>{
        input.value = 'FLASH';
        input.dispatchEvent(new Event('input', {bubbles: true }));

        expect(input.value).toBe('FLASH');
    })

})