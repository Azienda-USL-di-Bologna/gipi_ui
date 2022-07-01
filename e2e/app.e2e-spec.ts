import { GipiPage } from './app.po';

describe('gipi App', () => {
  let page: GipiPage;

  beforeEach(() => {
    page = new GipiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
