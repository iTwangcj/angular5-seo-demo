import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinComponent } from './spin.component';
import { SpinService } from './spin.service';
import { SpinManager } from './spin-manager';

@NgModule({
    imports: [CommonModule],
    declarations: [SpinComponent],
    exports: [SpinComponent],
    entryComponents: [SpinComponent]
})
export class SpinModule {
    static forRoot (): ModuleWithProviders {
        return {
            ngModule: SpinModule,
            providers: [SpinService, SpinManager]
        };
    }
}