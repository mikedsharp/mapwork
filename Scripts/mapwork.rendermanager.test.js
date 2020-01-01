// for when we have real modules
import { RenderManager } from './mapwork.rendermanager';
import { isIterable } from 'core-js';
let testRenderManager;
let MockEditorEnvironment = {};
describe('mapwork.rendermanager.js', () => {
  beforeEach(() => {
    testRenderManager = new RenderManager(MockEditorEnvironment);
  });
  describe('constructor', () => {
    it(`should instantiate RenderManager with some sensible defaults`, () => {
      expect(testRenderManager.mapModel).toEqual(null);
      expect(testRenderManager.camera).toEqual(null);
      expect(testRenderManager.renderFlag).toBe(true);
      expect(testRenderManager.viewFPS).toEqual(20);
      expect(testRenderManager.tilesetTilesAccross).toEqual(null);
      expect(testRenderManager.tilesetTilesDown).toEqual(null);
      expect(testRenderManager.pickerRowCount).toEqual(null);
      expect(testRenderManager.pickerTilesPerRow).toEqual(null);
      expect(testRenderManager.totalPickerTiles).toEqual(null);
    });
  });
  describe('Init()', () => {
    it(`should call InitiateRenderLoop()`, () => {
      const renderManagerSpy = jest.spyOn(
        testRenderManager,
        'InitiateRenderLoop'
      );
      testRenderManager.Init();
      expect(renderManagerSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('BindEvent()', () => {});
  describe('InitiateRenderLoop()', () => {});
  describe('DrawMap()', () => {});
  describe('clearCanvas(context, width, height)', () => {});
  describe('drawStencilBrush(context)', () => {});
  describe('renderMapTiles(context)', () => {});
  describe('renderAreaSelectTool(context)', () => {});
  describe('renderGrid(context)', () => {});
  describe('renderTilePicker()', () => {});
  describe('getPickerTileCode(x, y)', () => {});
});
