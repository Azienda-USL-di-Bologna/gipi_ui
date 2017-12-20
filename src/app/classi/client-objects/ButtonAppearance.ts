export class ButtonAppearance {
    _label: string = "";
    _icon: string = "";
    _viewIcon: boolean = false;
    _disabled: boolean = false;

    constructor(label: string, icon: string, viewIcon: boolean, disabled: boolean){
        this._label = label;
        this._icon = icon;
        this._viewIcon = viewIcon;
        this._disabled = disabled;
    }

    get label(): string{
        return this._label;
    }
    set label(label: string){
        this._label = label;
    }


    get icon(): string{
        return this._icon;
    }
    set icon(icon: string){
        this._icon = icon;
    }

    get viewIcon(): boolean{
        return this._viewIcon;
    }
    set viewIcon(viewIcon: boolean){
        this._viewIcon = viewIcon;
    }

    get disabled(): boolean{
        return this._disabled;
    }
    set disabled(disabled: boolean){
        this._disabled = disabled;
    }
}
