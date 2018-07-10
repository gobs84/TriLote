import { ScrapingModule } from './scraping.module';

describe('ScrapingModule', () => {
  let scrapingModule: ScrapingModule;

  beforeEach(() => {
    scrapingModule = new ScrapingModule();
  });

  it('should create an instance', () => {
    expect(scrapingModule).toBeTruthy();
  });
});
