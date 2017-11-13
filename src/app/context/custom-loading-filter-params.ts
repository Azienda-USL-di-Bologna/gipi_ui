export class CustomLoadingFilterParams {

  private targetField: string;
  private filter: Array<any>;

  constructor(targetField: string) {
    this.targetField = targetField;
  }

  public addFilter(filter: Array<any>) {
    this.filter = filter;
  }

  public getTargetField(): string {
    return this.targetField;
  }

  public getFilter() {
    return this.filter;
  }
}
