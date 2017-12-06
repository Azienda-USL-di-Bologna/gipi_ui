import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class GlobalContextService {

  private _buttonBarVisible: BehaviorSubject<boolean> = new BehaviorSubject(true);

  get buttonBarVisible(): Observable<boolean>{
    return this._buttonBarVisible.asObservable();
  }
  setButtonBarVisible(visible: boolean) {
    this._buttonBarVisible.next(visible);
  }

  constructor() { }

}
