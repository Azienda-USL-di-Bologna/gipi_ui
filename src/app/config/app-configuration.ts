import {Injectable} from "@angular/core";
import {GlobalContextService} from "@bds/nt-context";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AppConfiguration {

  constructor(private globalContextService: GlobalContextService) {
    this.setAppBarVisible(true);
    this.setSideBarVisible(true);
  }

  get appBarVisible(): Observable<boolean> {
    return this.globalContextService.getSubjectInnerSharedObject("_appBarVisible");
  }

  setAppBarVisible(value: boolean) {
    this.globalContextService.setSubjectInnerSharedObject("_appBarVisible", value);
  }

  get sideBarVisible(): Observable<boolean> {
    return this.globalContextService.getSubjectInnerSharedObject("_sideBarVisible");
  }

  setSideBarVisible(value: boolean) {
    this.globalContextService.setSubjectInnerSharedObject("_sideBarVisible", value);
  }
}