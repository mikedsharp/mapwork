// for when we have real modules
import { RenderManager } from './mapwork.rendermanager';
import { Camera } from './mapwork.view.camera';
import { Map } from './mapwork.model.map';
import { isIterable } from 'core-js';
import { Layer } from './mapwork.model.layer';
let testRenderManager;
let MockEditorEnvironment = {};
let mockLayer;

describe('mapwork.rendermanager.js barebones', () => {
  describe('constructor', () => {
    it(`should instantiate RenderManager with some sensible defaults`, () => {
      testRenderManager = new RenderManager(MockEditorEnvironment);
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
});
describe('mapwork.rendermanager.js', () => {
  beforeEach(() => {
    testRenderManager = new RenderManager(MockEditorEnvironment);
    testRenderManager.totalPickerTiles = 10;
    testRenderManager.mapModel = new Map({});
    testRenderManager.mapModel.createBlankModel('test', 32, 32, 8, 6);
    testRenderManager.camera = new Camera(testRenderManager.mapModel);
    testRenderManager.camera.setupCamera(0, 0, 128, 128, 1024, 768);
    MockEditorEnvironment.tilesetTilesAccross = 10;
    MockEditorEnvironment.tilesetTilesDown = 1;
    MockEditorEnvironment.pickerRowCount = 1;
    MockEditorEnvironment.pickerTilesPerRow = 10;
    MockEditorEnvironment.selectedAreaTiles = {
      rows: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]
    };
    MockEditorEnvironment.selectedLayer = 0;
    mockLayer = new Layer(MockEditorEnvironment);
    mockLayer.zPosition = 0;
    testRenderManager.mapModel.layers = [];
    testRenderManager.mapModel.addLayer(mockLayer);
    mockLayer.createBlankModelLayer(
      testRenderManager.mapModel,
      'new-layer',
      ''
    );

    document.body.innerHTML = `<div>
      <canvas id="editorCanvas"></canvas>
    </div>
    `;
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
      MockEditorEnvironment.selectedTool = 'pasteTiles';
    });
    it(`should run all rendering routines, as we have a map model and render flag is set to true`, () => {
      testRenderManager.renderFlag = true;
      testRenderManager.DrawMap();
      const canvas = document.getElementById('editorCanvas');
      const context = canvas.getContext('2d');

      expect(clearCanvasSpy).toHaveBeenCalledTimes(1);
      expect(renderMapTilesSpy).toHaveBeenCalledTimes(1);
      expect(renderAreaSelectToolSpy).toHaveBeenCalledTimes(1);
      expect(drawStencilBrushSpy).toHaveBeenCalledTimes(1);
      expect(renderTilePickerSpy).toHaveBeenCalledTimes(1);
      expect(renderGridSpy).toHaveBeenCalledTimes(1);

      expect(clearCanvasSpy).toHaveBeenCalledWith(
        context,
        canvas.width,
        canvas.height
      );
      expect(renderMapTilesSpy).toHaveBeenCalledWith(context);
      expect(renderAreaSelectToolSpy).toHaveBeenCalledWith(context);
      expect(drawStencilBrushSpy).toHaveBeenCalledWith(context);
      expect(renderGridSpy).toHaveBeenCalledWith(context);
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
  describe('clearCanvas(context, width, height)', () => {
    let canvas, context, width, height;
    beforeEach(() => {
      canvas = document.getElementById('editorCanvas');
      context = canvas.getContext('2d');
      width = 640;
      height = 480;
    });
    it(`should adjust canvas context to draw a white fill colour`, () => {
      testRenderManager.clearCanvas(context, width, height);
      expect(context.fillStyle).toEqual('#fff');
    });
    it(`should call fillRect to fill the canvas with fill colour to 'clear' it for next frame`, () => {
      const canvasFillRectSpy = jest.spyOn(context, 'fillRect');
      testRenderManager.clearCanvas(context, width, height);
      expect(canvasFillRectSpy).toHaveBeenCalledTimes(1);
      expect(canvasFillRectSpy).toHaveBeenLastCalledWith(0, 0, width, height);
    });
  });
  describe('drawStencilBrush(context)', () => {
    let canvas, context, width, height;
    let contextStrokeRectSpy;
    let contextDrawImageSpy;

    beforeEach(() => {
      jest.clearAllMocks();
      canvas = document.getElementById('editorCanvas');
      context = canvas.getContext('2d');
      width = 640;
      height = 480;
      contextStrokeRectSpy = jest.spyOn(context, 'strokeRect');
      contextDrawImageSpy = jest.spyOn(context, 'drawImage');
    });
    it(`should proceed to drawing the stencilBrush on the canvas,
      because the selectedTool is 'pasteTiles' and an area is selected to paste`, () => {
      MockEditorEnvironment.selectedTool = 'pasteTiles';
      testRenderManager.drawStencilBrush(context);
      expect(contextDrawImageSpy).toHaveBeenCalledTimes(10);
      expect(contextStrokeRectSpy).toHaveBeenCalledTimes(1);
    });
    it(`should not draw stencil brush, there are no tiles selected to paste`, () => {
      // testRenderManager.drawStencilBrush(context);
      MockEditorEnvironment.selectedAreaTiles = null;
      MockEditorEnvironment.selectedTool = 'pasteTiles';
      expect(contextDrawImageSpy).not.toHaveBeenCalled();
      expect(contextStrokeRectSpy).not.toHaveBeenCalled();
    });
    it(`should not draw stencil brush, the selected tool is not the 'pasteTiles' tool`, () => {
      MockEditorEnvironment.selectedAreaTiles = { rows: [{}, {}, {}] };
      MockEditorEnvironment.selectedTool = null;
      testRenderManager.drawStencilBrush(context);
      expect(contextDrawImageSpy).not.toHaveBeenCalled();
      expect(contextStrokeRectSpy).not.toHaveBeenCalled();
    });
  });
  describe('renderMapTiles(context)', () => {});
  describe('renderAreaSelectTool(context)', () => {});
  describe('renderGrid(context)', () => {});
  describe('renderTilePicker()', () => {});
  describe('getPickerTileCode(x, y)', () => {});
});
