// for when we have real modules
import { RenderManager } from './mapwork.rendermanager';
import { Camera } from './mapwork.view.camera';
import { Map } from './mapwork.model.map';
import { isIterable } from 'core-js';
let testRenderManager;
let MockEditorEnvironment = {};
describe('mapwork.rendermanager.js', () => {
  beforeEach(() => {
    testRenderManager = new RenderManager(MockEditorEnvironment);
    testRenderManager.mapModel = new Map({});
    testRenderManager.mapModel.createBlankModel('test', 32, 32, 8, 6);
    testRenderManager.camera = new Camera(testRenderManager.mapModel);
    testRenderManager.camera.setupCamera(0, 0, 128, 128, 1024, 768);

    document.body.innerHTML = `<div>
      <canvas id="editorCanvas"></canvas>
    </div>
    `;
  });
  describe('constructor', () => {
    it(`should instantiate RenderManager with some sensible defaults`, () => {
      // expect(testRenderManager.mapModel).toEqual(null);
      // expect(testRenderManager.camera).toEqual(null);
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
  describe('InitiateRenderLoop()', () => {
    it(`should create a timeout that calls the DrawMap function`, () => {
      jest.useFakeTimers();
      testRenderManager.InitiateRenderLoop();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 50);
    });
  });
  describe('DrawMap()', () => {
    jest.clearAllMocks();
    let clearCanvasSpy,
      renderMapTilesSpy,
      renderAreaSelectToolSpy,
      drawStencilBrushSpy,
      renderGridSpy,
      renderTilePickerSpy;

    beforeEach(() => {
      clearCanvasSpy = jest.spyOn(testRenderManager, 'clearCanvas');
      renderMapTilesSpy = jest.spyOn(testRenderManager, 'renderMapTiles');
      renderAreaSelectToolSpy = jest.spyOn(
        testRenderManager,
        'renderAreaSelectTool'
      );
      drawStencilBrushSpy = jest.spyOn(testRenderManager, 'drawStencilBrush');
      renderTilePickerSpy = jest.spyOn(testRenderManager, 'renderTilePicker');
      renderGridSpy = jest.spyOn(testRenderManager, 'renderGrid');
    });
    it(`should run all rendering routines, as we have a map model and render flag is set to true`, () => {
      testRenderManager.renderFlag = true;
      testRenderManager.DrawMap();

      expect(clearCanvasSpy).toHaveBeenCalledTimes(1);
      expect(renderMapTilesSpy).toHaveBeenCalledTimes(1);
      expect(renderAreaSelectToolSpy).toHaveBeenCalledTimes(1);
      expect(drawStencilBrushSpy).toHaveBeenCalledTimes(1);
      expect(renderTilePickerSpy).toHaveBeenCalledTimes(1);
      expect(renderGridSpy).toHaveBeenCalledTimes(1);
    });
    it(`should not run any rendering routines, render flag is set to false`, () => {
      testRenderManager.renderFlag = false;
      testRenderManager.DrawMap();

      expect(clearCanvasSpy).not.toHaveBeenCalled();
      expect(renderMapTilesSpy).not.toHaveBeenCalled();
      expect(renderAreaSelectToolSpy).not.toHaveBeenCalled();
      expect(drawStencilBrushSpy).not.toHaveBeenCalled();
      expect(renderTilePickerSpy).not.toHaveBeenCalled();
    });
    it(`should not run any rendering routines, we have no map model`, () => {
      testRenderManager.renderFlag = true;
      testRenderManager.mapModel = null;
      testRenderManager.DrawMap();

      expect(clearCanvasSpy).not.toHaveBeenCalled();
      expect(renderMapTilesSpy).not.toHaveBeenCalled();
      expect(renderAreaSelectToolSpy).not.toHaveBeenCalled();
      expect(drawStencilBrushSpy).not.toHaveBeenCalled();
      expect(renderTilePickerSpy).not.toHaveBeenCalled();
    });
  });
  describe('clearCanvas(context, width, height)', () => {});
  describe('drawStencilBrush(context)', () => {});
  describe('renderMapTiles(context)', () => {});
  describe('renderAreaSelectTool(context)', () => {});
  describe('renderGrid(context)', () => {});
  describe('renderTilePicker()', () => {});
  describe('getPickerTileCode(x, y)', () => {});
});
