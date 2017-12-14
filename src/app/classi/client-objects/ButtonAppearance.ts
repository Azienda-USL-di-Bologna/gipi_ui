export class ButtonAppearance {
    label: string = "";
    icon: string = "";
    viewIcon: boolean = false;

    constructor(label: string, icon: string, viewIcon: boolean){
        this.label = label;
        this.icon = icon;
        this.viewIcon = viewIcon;
    }
}
