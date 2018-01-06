import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ModalComponent, ModalRef } from './modal.component';
import { ModalService } from './modal.service';
import { CloseModule } from './close';

@NgModule({
    imports: [CommonModule, CloseModule],
    declarations: [ModalComponent],
    exports: [CloseModule],
    entryComponents: [ModalComponent]
})
export class ModalModule {
    static forRoot (): ModuleWithProviders {
        return {
            ngModule: ModalModule,
            providers: [ModalService, ModalRef]
        };
    }
}