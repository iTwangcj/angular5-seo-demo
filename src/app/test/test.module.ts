import { NgModule, ModuleWithProviders } from '@angular/core';
import { TestService } from './test.service';

@NgModule({
	imports: [],
	declarations: [],
	exports: [],
	entryComponents: []
})
export class TestModule {
	static forRoot (): ModuleWithProviders {
		return {
			ngModule: TestModule,
            providers: [TestService]
		};
	}
}
