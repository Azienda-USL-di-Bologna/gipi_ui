import { Injectable } from '@angular/core';

@Injectable()
export class SharedData {

    public sharedObject: any;

    public constructor() { }
}

export const SharedObjectKeys = {
    CURRENT_DOCUMENT: "CURRENT_DOCUMENT",
};
