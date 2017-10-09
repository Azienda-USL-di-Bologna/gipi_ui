import { Injectable } from '@angular/core';

@Injectable()
export class SharedData {

    sharedObject: any = new Object();

    public constructor() { }

    public getSharedObject(): any {
        return this.sharedObject;
    }
}

export const SharedObjectKeys = {
    CURRENT_DOCUMENT: "CURRENT_DOCUMENT",
};
