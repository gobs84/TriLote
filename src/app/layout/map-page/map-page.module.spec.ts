import { MapPageModule } from './map-page.module';

describe('MapPageModule', () => {
    let mapPageModule: MapPageModule;

    beforeEach(() => {
        mapPageModule = new MapPageModule();
    });

    it('should create an instance', () => {
        expect(mapPageModule).toBeTruthy();
    });
});
