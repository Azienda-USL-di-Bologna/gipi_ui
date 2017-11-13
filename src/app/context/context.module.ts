import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContextModuleConfig} from "./context-module-config";
import {SharedData} from "./shared-data";
import {OdataContextFactory} from "./odata-context-factory";



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})

export class ContextModule {
  static forRoot(config: ContextModuleConfig): ModuleWithProviders {
    return {
      ngModule: ContextModule,
      providers: [OdataContextFactory, {provide: 'config', useValue: config}, SharedData]
    }
  }
}
