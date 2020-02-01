// for when we have real modules
import { RenderManager } from './mapwork.rendermanager';
import { Camera } from './mapwork.view.camera';
import { Map } from './mapwork.model.map';
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
    mockLayer.tilesetWidth = 128;
    mockLayer.tilesetHeight = 64;
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
    <div>
      <div id="paletteDialog" style="visibility:visible;display:block;">
      </div>
      <canvas id="paletteCanvas"></canvas>
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
      MockEditorEnvironment.selectedAreaTiles = null;
      MockEditorEnvironment.selectedTool = 'pasteTiles';
      testRenderManager.drawStencilBrush(context);
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
  describe('renderMapTiles(context)', () => {
    let canvas, context, width, height;
    let drawImageSpy;
    beforeEach(() => {
      jest.clearAllMocks();
      canvas = document.getElementById('editorCanvas');
      context = canvas.getContext('2d');
      width = 640;
      height = 480;
      drawImageSpy = jest.spyOn(context, 'drawImage');
    });
    it(`should render 0 tiles, as the map only contains 'empty' -1 tiles`, () => {
      testRenderManager.renderMapTiles(context);
      expect(drawImageSpy).not.toHaveBeenCalled();
    });
    it(`should render 5 tiles, as 5 tiles on the map have been defined (i.e. are not -1)`, () => {
      testRenderManager.mapModel.layers[0].getTile(1, 1).setTileCode(1);
      testRenderManager.mapModel.layers[0].getTile(1, 2).setTileCode(1);
      testRenderManager.mapModel.layers[0].getTile(2, 1).setTileCode(1);
      testRenderManager.mapModel.layers[0].getTile(3, 3).setTileCode(1);
      testRenderManager.mapModel.layers[0].getTile(2, 2).setTileCode(1);
      testRenderManager.renderMapTiles(context);
      expect(drawImageSpy).toHaveBeenCalledTimes(5);
    });
    it(`should render 16 of the 48 tiles on map, as all are defined with a tilecode that isn't -1, but the camera crops the canvas 
          to an area of 4 x 4 tiles`, () => {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 6; j++) {
          testRenderManager.mapModel.layers[0].getTile(i, j).setTileCode(1);
        }
      }
      testRenderManager.renderMapTiles(context);
      expect(drawImageSpy).toHaveBeenCalledTimes(16);
    });
    it(`should render 0 tiles on map, the layers are set to be invisible`, () => {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 6; j++) {
          testRenderManager.mapModel.layers[0].getTile(i, j).setTileCode(1);
        }
      }
      testRenderManager.mapModel.layers[0].setVisibility(false);
      testRenderManager.camera.setupCamera(0, 0, 256, 192, 256, 192);
      testRenderManager.renderMapTiles(context);
      expect(drawImageSpy).toHaveBeenCalledTimes(0);
    });

    it(`should render all 48 tiles on map, as all are defined with a tilecode that isn't -1, and the camera is
        clipped to the whole span of the map`, () => {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 6; j++) {
          testRenderManager.mapModel.layers[0].getTile(i, j).setTileCode(1);
        }
      }
      testRenderManager.camera.setupCamera(0, 0, 256, 192, 256, 192);
      testRenderManager.renderMapTiles(context);
      expect(drawImageSpy).toHaveBeenCalledTimes(48);
    });
  });
  describe('renderAreaSelectTool(context)', () => {
    let canvas, context, width, height;
    let strokeRectSpy;
    beforeEach(() => {
      jest.clearAllMocks();
      canvas = document.getElementById('editorCanvas');
      context = canvas.getContext('2d');
      width = 640;
      height = 480;
      strokeRectSpy = jest.spyOn(context, 'strokeRect');
    });
    it(`should not make any calls to strokeRect,
          because EditorEnvironment.areaSelectEnabled is 'false'`, () => {
      MockEditorEnvironment.areaSelectX = 0;
      MockEditorEnvironment.mouseX = 128;
      MockEditorEnvironment.areaSelectY = 0;
      MockEditorEnvironment.mouseY = 128;

      MockEditorEnvironment.areaSelectEnabled = false;
      testRenderManager.renderAreaSelectTool(context);
      expect(strokeRectSpy).not.toHaveBeenCalled();
    });

    it(`should call strokeRect, because areaSelectEnabled is 'true'`, () => {
      MockEditorEnvironment.areaSelectX = 0;
      MockEditorEnvironment.mouseX = 128;
      MockEditorEnvironment.areaSelectY = 0;
      MockEditorEnvironment.mouseY = 128;

      MockEditorEnvironment.areaSelectEnabled = true;
      testRenderManager.renderAreaSelectTool(context);
      expect(strokeRectSpy).toHaveBeenCalledTimes(1);
    });
    it(`should call strokeRect, areaSelectX < mouseX`, () => {
      MockEditorEnvironment.areaSelectX = 0;
      MockEditorEnvironment.mouseX = 128;
      MockEditorEnvironment.areaSelectY = 0;
      MockEditorEnvironment.mouseY = 128;

      MockEditorEnvironment.areaSelectEnabled = true;
      testRenderManager.renderAreaSelectTool(context);
      expect(strokeRectSpy).toHaveBeenCalledWith(
        MockEditorEnvironment.areaSelectX,
        MockEditorEnvironment.areaSelectY,
        128,
        128
      );
    });

    it(`should call strokeRect, areaSelectX > mouseX`, () => {
      MockEditorEnvironment.areaSelectX = 128;
      MockEditorEnvironment.mouseX = 0;
      MockEditorEnvironment.areaSelectY = 0;
      MockEditorEnvironment.mouseY = 128;

      MockEditorEnvironment.areaSelectEnabled = true;
      testRenderManager.renderAreaSelectTool(context);
      expect(strokeRectSpy).toHaveBeenCalledWith(
        MockEditorEnvironment.mouseX,
        MockEditorEnvironment.areaSelectY,
        128,
        128
      );
    });

    it(`should call strokeRect, areaSelectY > mouseY`, () => {
      MockEditorEnvironment.areaSelectX = 128;
      MockEditorEnvironment.mouseX = 0;
      MockEditorEnvironment.areaSelectY = 128;
      MockEditorEnvironment.mouseY = 0;

      MockEditorEnvironment.areaSelectEnabled = true;
      testRenderManager.renderAreaSelectTool(context);
      expect(strokeRectSpy).toHaveBeenCalledWith(
        MockEditorEnvironment.mouseX,
        MockEditorEnvironment.mouseY,
        128,
        128
      );
    });
    it(`should call strokeRect, areaSelectY < mouseY`, () => {
      MockEditorEnvironment.areaSelectX = 128;
      MockEditorEnvironment.mouseX = 0;
      MockEditorEnvironment.areaSelectY = 0;
      MockEditorEnvironment.mouseY = 128;

      MockEditorEnvironment.areaSelectEnabled = true;
      testRenderManager.renderAreaSelectTool(context);
      expect(strokeRectSpy).toHaveBeenCalledWith(
        MockEditorEnvironment.mouseX,
        MockEditorEnvironment.areaSelectY,
        128,
        128
      );
    });
  });
  describe('renderGrid(context)', () => {
    let canvas, context, width, height;
    let contextStrokeSpy,
      contextLineToSpy,
      contextMoveToSpy,
      contextBeginPathSpy;
    beforeEach(() => {
      jest.clearAllMocks();
      canvas = document.getElementById('editorCanvas');
      context = canvas.getContext('2d');
      width = 640;
      height = 480;
      contextStrokeSpy = jest.spyOn(context, 'stroke');
      contextLineToSpy = jest.spyOn(context, 'lineTo');
      contextMoveToSpy = jest.spyOn(context, 'moveTo');
      contextBeginPathSpy = jest.spyOn(context, 'beginPath');
    });
    it(`should call context.stroke 14 times to draw grid lines at each row and
        column of the map within the camera`, () => {
      testRenderManager.camera.setupCamera(0, 0, 256, 192, 256, 192);
      MockEditorEnvironment.gridEnabled = true;
      testRenderManager.renderGrid(context);
      expect(contextStrokeSpy).toHaveBeenCalledTimes(14);
      expect(contextBeginPathSpy).toHaveBeenCalledTimes(14);
      expect(contextMoveToSpy).toHaveBeenCalledTimes(14);
      expect(contextLineToSpy).toHaveBeenCalledTimes(14);
    });

    it(`should call context.stroke 8 times to draw grid lines at each row and
    column of the map within the camera, the camera is restricted to 128x128 of the map`, () => {
      testRenderManager.camera.setupCamera(0, 0, 128, 128, 128, 128);
      MockEditorEnvironment.gridEnabled = true;
      testRenderManager.renderGrid(context);
      expect(contextStrokeSpy).toHaveBeenCalledTimes(8);
      expect(contextBeginPathSpy).toHaveBeenCalledTimes(8);
      expect(contextMoveToSpy).toHaveBeenCalledTimes(8);
      expect(contextLineToSpy).toHaveBeenCalledTimes(8);
    });

    it(`should not call any rendering functions, because EditorEnvironment.gridEnabled is 'false'`, () => {
      testRenderManager.camera.setupCamera(0, 0, 256, 192, 256, 192);
      MockEditorEnvironment.gridEnabled = false;
      testRenderManager.renderGrid(context);
      expect(contextStrokeSpy).not.toHaveBeenCalled();
      expect(contextBeginPathSpy).not.toHaveBeenCalled();
      expect(contextMoveToSpy).not.toHaveBeenCalled();
      expect(contextLineToSpy).not.toHaveBeenCalled();
    });
  });
  describe('renderTilePicker()', () => {
    let canvas, context, width, height;
    let jQuerySpy;
    let contextFillSpy, contextDrawImage;
    beforeEach(() => {
      jest.clearAllMocks();
      canvas = document.getElementById('paletteCanvas');
      context = canvas.getContext('2d');
      width = 640;
      height = 480;
      testRenderManager.pickerRowCount = 2;
      testRenderManager.pickerTilesPerRow = 5;
      contextFillSpy = jest.spyOn(context, 'fill');
      contextDrawImage = jest.spyOn(context, 'drawImage');
    });
    it(`should refresh picker canvas with a fill colour and then render each tile in the tileset`, () => {
      testRenderManager.renderTilePicker(true);
      expect(contextFillSpy).toHaveBeenCalledTimes(1);
      expect(contextDrawImage).toHaveBeenCalledTimes(10);
    });
  });
  describe('getPickerTileCode(x, y)', () => {
    beforeEach(() => {
      testRenderManager.pickerRowCount = 2;
      testRenderManager.pickerTilesPerRow = 5;
    });
    it(`should return the tilecode of 2 for a given set of mouse X,Y co-ordinates on the canvas`, () => {
      testRenderManager.getPickerTileCode(64, 8);
      expect(MockEditorEnvironment.selectedPalleteTile).toEqual(2);
    });
  });
});
