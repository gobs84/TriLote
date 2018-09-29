import { StatisticsPageModule } from './statistics-page.module';

describe('StatistiscPageModule', () => {
  let statistiscPageModule: StatisticsPageModule;

  beforeEach(() => {
    statistiscPageModule = new StatisticsPageModule();
  });

  it('should create an instance', () => {
    expect(statistiscPageModule).toBeTruthy();
  });
});
