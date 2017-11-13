import { Injectable } from '@angular/core';

@Injectable()
export class SharedData {

    private sharedObject: any = new Object();

    public constructor() { }

    public getSharedObject(): any {
        return this.sharedObject;
    }

    public setSharedObject(obj : any) { 
        this.sharedObject = obj;
    }
}
