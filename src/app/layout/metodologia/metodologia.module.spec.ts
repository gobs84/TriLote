import { MetodologiaModule } from './metodologia.module';

describe('MetodologiaModule', () => {
  let metodologiaModule: MetodologiaModule;

  beforeEach(() => {
    metodologiaModule = new MetodologiaModule();
  });

  it('should create an instance', () => {
    expect(metodologiaModule).toBeTruthy();
  });
});
