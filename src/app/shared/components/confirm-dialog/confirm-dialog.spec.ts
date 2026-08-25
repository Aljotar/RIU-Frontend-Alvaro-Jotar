import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ConfirmDialog } from "./confirm-dialog"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";




describe('ConfirmDialog', () => {
    let fixture: ComponentFixture<ConfirmDialog>;
    let close: ReturnType<typeof vi.fn>;

    beforeEach(async() => {
        close = vi.fn();

        await TestBed.configureTestingModule({
            imports: [ ConfirmDialog ],
            providers: [
            {
                provide: MAT_DIALOG_DATA,
                useValue: {
                    title: 'Confirmar borrado',
                    message: '¿Seguro que queres borrar a Spider-Man?',
                }
            },
            {
                provide: MatDialogRef,
                useValue: { close }
            }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialog);
        fixture.detectChanges();
    })


    it('should create', () =>{
        expect(fixture.componentInstance).toBeTruthy();
    });


    it('should render title and mesage', () =>{
        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('Confirmar borrado');
        expect(el.textContent).toContain('¿Seguro que queres borrar a Spider-Man?')
    })

    it('should close white false when Cancelar is clicked', () => {
        const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
        const cancelBtn = Array.from(buttons).find((b) => 
            b.textContent?.includes('Cancelar')
        );

        cancelBtn?.click();

        expect(close).toHaveBeenCalledWith(false);
    });

    it('should close white true when Borrar is clicked', () => {
        const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
        const deleteBtn = Array.from(buttons).find((b) => 
            b.textContent?.includes('Borrar')
        );

        deleteBtn?.click();

        expect(close).toHaveBeenCalledWith(true);
    });

    

})