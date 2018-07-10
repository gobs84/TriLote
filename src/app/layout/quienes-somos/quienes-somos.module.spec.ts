import { QuienesSomosModule } from './quienes-somos.module';

describe('QuienesSomosModule', () => {
  let quienesSomosModule: QuienesSomosModule;

  beforeEach(() => {
    quienesSomosModule = new QuienesSomosModule();
  });

  it('should create an instance', () => {
    expect(quienesSomosModule).toBeTruthy();
  });
});
