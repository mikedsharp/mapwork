import { Map } from './mapwork.model.map';
import { Layer } from './mapwork.model.layer';
let testMap;

const mockEditorEnvironment = {
  PalletCanvasResize: jest.fn(() => {
    return;
  })
};

describe(`mapwork.model.map map object`, () => {
  beforeEach(() => {
    testMap = new Map(mockEditorEnvironment);
  });
  describe(`constructor`, () => {
    it(`should provide some reasonable defaults when constructing the map object`, () => {
      expect(testMap.properties).toEqual([]);
      expect(testMap.name).toEqual(null);
      expect(testMap.tileWidth).toEqual(null);
      expect(testMap.tileHeight).toEqual(null);
      expect(testMap.tilesAccross).toEqual(null);
      expect(testMap.tilesDown).toEqual(null);
      expect(testMap.layers).toEqual([]);
    });
  });
  describe(`removeProperty(key)`, () => {
    it(`should remove a property from the map object`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'c', value: 3 }
      ];
      testMap.properties = originalProperties;
      testMap.removeProperty('b');
      expect(testMap.properties.length).toEqual(2);
      expect(testMap.properties).toEqual(expectedProperties);
    });
    it(`should not remove a property from the map object, because the property key requested doesn't exist`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      testMap.properties = originalProperties;
      testMap.removeProperty('x');
      expect(testMap.properties.length).toEqual(3);
      expect(testMap.properties).toEqual(expectedProperties);
    });
  });
  describe(`setProperty(property)`, () => {
    it(`should update a property in the map object`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 4 },
        { key: 'c', value: 3 }
      ];
      testMap.properties = originalProperties;
      testMap.setProperty({ oldKey: 'b', newKey: 'b', newValue: 4 });
      expect(testMap.properties.length).toEqual(3);
      expect(testMap.properties).toEqual(expectedProperties);
    });
    it(`should remain unchanged because the property being set doesn't exist`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      testMap.properties = originalProperties;
      testMap.setProperty({ oldKey: 'x', newKey: 'x', newValue: 4 });
      expect(testMap.properties.length).toEqual(3);
      expect(testMap.properties).toEqual(expectedProperties);
    });
  });
  describe(`getProperty(key)`, () => {
    beforeEach(() => {
      testMap.properties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 'thing' },
        { key: 'c', value: 3 }
      ];
    });
    it(`should return a property for a given key`, () => {
      const expectedProperty = 'thing';
      expect(testMap.getProperty('b')).toEqual(expectedProperty);
    });
    it(`should not return anything as the property doesn't exist`, () => {
      expect(testMap.getProperty('x')).not.toBeDefined();
    });
  });
  describe(`addProperty(prop)`, () => {
    it(`should add a given property to the Map objects properties`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 }
      ];
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      const newProperty = {
        key: 'c',
        value: 3
      };
      testMap.properties = originalProperties;
      testMap.addProperty(newProperty);
      expect(testMap.properties).toEqual(expectedProperties);
    });
  });
  describe(`getLayerByZPosition(zPosition)`, () => {
    let layers = [];
    beforeEach(() => {
      layers = [];
      layers.push(new Layer());
      layers.push(new Layer());
      layers.push(new Layer());
      testMap.layers = layers;
    });
    it(`[ordered list of layers] should retrieve correct layer by its Z-co-ordinate`, () => {
      layers[0].zPosition = 0;
      layers[1].zPosition = 1;
      layers[2].zPosition = 2;
      const expectedLayer = layers[1];
      const returnedLayer = testMap.getLayerByZPosition(1);
      expect(returnedLayer).toEqual(expectedLayer);
    });
    it(`[unordered ordered list of layers] should retrieve correct layer by its Z-co-ordinate`, () => {
      layers[0].zPosition = 10;
      layers[1].zPosition = 5;
      layers[2].zPosition = 20;
      const expectedLayer = layers[2];
      const returnedLayer = testMap.getLayerByZPosition(20);
      expect(returnedLayer).toEqual(expectedLayer);
    });
    it(`should return nothing, as no layer with specified z-index exists in Map object`, () => {
      layers[0].zPosition = 10;
      layers[1].zPosition = 5;
      layers[2].zPosition = 20;
      const returnedLayer = testMap.getLayerByZPosition(-12);
      expect(returnedLayer).not.toBeDefined();
    });
  });
  describe(`getLayer(index)`, () => {
    let layers = [];
    beforeEach(() => {
      layers = [];
      layers.push(new Layer());
      layers.push(new Layer());
      layers.push(new Layer());
      testMap.layers = layers;
    });
    it(`should retrieve correct layer by referencing a given index`, () => {
      const expectedLayer = layers[1];
      const returnedLayer = testMap.getLayer(1);
      expect(returnedLayer).toEqual(expectedLayer);
    });
    it(`should return nothing, as no layer with specified z-index exists in Map object`, () => {
      const returnedLayer = testMap.getLayer(55);
      expect(returnedLayer).not.toBeDefined();
    });
  });
  describe(`getLayers()`, () => {
    it(`should return all layers of the map untransformed`, () => {
      const originalLayers = [new Layer(), new Layer(), new Layer()];
      testMap.layers = originalLayers;
      expect(testMap.getLayers()).toEqual(originalLayers);
    });
  });
  describe(`addLayer(layer)`, () => {
    it(`should add a layer to list of maps layers`, () => {
      const originalLayers = [new Layer(), new Layer(), new Layer()];
      const newLayer = new Layer();
      newLayer.setZPosition(33);
      const expectedLayers = [...originalLayers, newLayer];
      testMap.layers = originalLayers;
      testMap.addLayer(newLayer);
      expect(testMap.layers).toEqual(expectedLayers);
    });
  });
  describe(`removeLayer(zPosition)`, () => {
    it(`should remove a layer from the map with a given zPosition`, () => {
      const originalLayers = [new Layer(), new Layer(), new Layer()];
      originalLayers[0].zPosition = 0;
      originalLayers[1].zPosition = 1;
      originalLayers[2].zPosition = 2;
      testMap.layers = originalLayers;
      const expectedLayers = [originalLayers[0], originalLayers[2]];
      testMap.removeLayer(1);
      expect(testMap.layers.length).toEqual(2);
      expect(testMap.layers).toEqual(expectedLayers);
    });
    it(`should do nothing, as there are no layers with the specified z position`, () => {
      const originalLayers = [new Layer(), new Layer(), new Layer()];
      originalLayers[0].zPosition = 0;
      originalLayers[1].zPosition = 1;
      originalLayers[2].zPosition = 2;
      testMap.layers = originalLayers;
      testMap.removeLayer(55);
      expect(testMap.layers.length).toEqual(3);
      expect(testMap.layers).toEqual(originalLayers);
    });
  });
  describe(`swapLayers(zPositionOne, zPositionTwo)`, () => {
    it(`should swap around the zPositions and indexes of two layers (layer 1 > layer 2)`, () => {
      const layerOne = new Layer();
      const layerTwo = new Layer();
      layerOne.name = 'originalLayerOne';
      layerTwo.name = 'originalLayerTwo';
      layerOne.zPosition = 10;
      layerTwo.zPosition = 4;
      testMap.layers = [layerOne, layerTwo];
      testMap.swapLayers(layerOne.zPosition, layerTwo.zPosition);
      expect(testMap.layers[0].zPosition).toEqual(10);
      expect(testMap.layers[1].zPosition).toEqual(4);
      expect(testMap.layers[0].name).toEqual('originalLayerTwo');
      expect(testMap.layers[1].name).toEqual('originalLayerOne');
    });
    it(`should swap around the zPositions and indexes of two layers (layer 1 < layer 2)`, () => {
      const layerOne = new Layer();
      const layerTwo = new Layer();
      layerOne.name = 'originalLayerOne';
      layerTwo.name = 'originalLayerTwo';
      layerOne.zPosition = 4;
      layerTwo.zPosition = 10;
      testMap.layers = [layerOne, layerTwo];
      testMap.swapLayers(layerOne.zPosition, layerTwo.zPosition);
      expect(testMap.layers[0].zPosition).toEqual(4);
      expect(testMap.layers[1].zPosition).toEqual(10);
      expect(testMap.layers[0].name).toEqual('originalLayerTwo');
      expect(testMap.layers[1].name).toEqual('originalLayerOne');
    });
    it(`layers should have the same position after swapLayers is called`, () => {
      const layerOne = new Layer();
      const layerTwo = new Layer();
      layerOne.zPosition = 4;
      layerTwo.zPosition = 4;
      testMap.layers = [layerOne, layerTwo];
      testMap.swapLayers(layerOne.zPosition, layerTwo.zPosition);
      expect(testMap.layers[0].zPosition).toEqual(4);
      expect(testMap.layers[1].zPosition).toEqual(4);
    });
  });
  describe(`setLayer(layer, index)`, () => {
    it(`should replace a layer at a given index within a maps list of layers`, () => {
      const originalLayers = [new Layer(), new Layer(), new Layer()];
      const replacementLayer = new Layer();
      originalLayers[0].name = 'one';
      originalLayers[1].name = 'two';
      originalLayers[2].name = 'three';
      testMap.layers = originalLayers;
      replacementLayer.zPosition = 2;
      replacementLayer.name = 'replacement';
      testMap.setLayer(replacementLayer, 1);
      expect(testMap.layers.length).toEqual(3);
      expect(testMap.layers[1]).toEqual(replacementLayer);
    });
  });
  describe(`setName(mapName)`, () => {
    it(`should change the name of the map`, () => {
      const originalName = 'old map name';
      const newName = 'new map name';
      testMap.name = originalName;
      testMap.setName(newName);
      expect(testMap.name).toEqual(newName);
    });
  });
  describe(`getName()`, () => {
    it(`should return the name of the map`, () => {
      const expectedName = 'map name';
      testMap.name = expectedName;
      expect(testMap.getName()).toEqual(expectedName);
    });
  });
  describe(`setTileWidth(amount)`, () => {
    it(`should set the width of tiles within the map with a given integer value`, () => {
      testMap.tileWidth = 32;
      const expectedValue = 16;
      testMap.setTileWidth(16);
      expect(testMap.tileWidth).toEqual(expectedValue);
    });
    it(`should set the width of tiles within the map with a given floating point value, but will remove fractional component`, () => {
      testMap.tileWidth = 32;
      const expectedValue = 16;
      testMap.setTileWidth(16.65);
      expect(testMap.tileWidth).toEqual(expectedValue);
    });
    it(`should set the width of tiles within the map with a given number string value, but will parse the string to an int`, () => {
      testMap.tileWidth = 32;
      const expectedValue = 16;
      testMap.setTileWidth('16');
      expect(testMap.tileWidth).toEqual(expectedValue);
    });
  });
  describe(`getTileWidth()`, () => {
    it(`should return the current tileWidth of tiles on the map`, () => {
      const expectedValue = 32;
      testMap.tileWidth = 32;
      expect(testMap.getTileWidth()).toEqual(expectedValue);
    });
  });
  describe(`setTileHeight(amount)`, () => {
    it(`should set the height of tiles within the map with a given integer value`, () => {
      testMap.tileHeight = 32;
      const expectedValue = 16;
      testMap.setTileHeight(16);
      expect(testMap.tileHeight).toEqual(expectedValue);
    });
    it(`should set the height of tiles within the map with a given floating point value, but will remove fractional component`, () => {
      testMap.tileHeight = 32;
      const expectedValue = 16;
      testMap.setTileHeight(16.65);
      expect(testMap.tileHeight).toEqual(expectedValue);
    });
    it(`should set the height of tiles within the map with a given number string value, but will parse the string to an int`, () => {
      testMap.tileHeight = 32;
      const expectedValue = 16;
      testMap.setTileHeight('16');
      expect(testMap.tileHeight).toEqual(expectedValue);
    });
  });
  describe(`getTileHeight()`, () => {
    it(`should return the current tileHeight of tiles on the map`, () => {
      const expectedValue = 32;
      testMap.tileHeight = 32;
      expect(testMap.getTileHeight()).toEqual(expectedValue);
    });
  });
  describe(`setTilesAccross(amount)`, () => {
    it(`should set the number of tiles horizontally across the map with a given integer value`, () => {
      testMap.tilesAccross = 32;
      const expectedValue = 16;
      testMap.setTilesAccross(16);
      expect(testMap.tilesAccross).toEqual(expectedValue);
    });
  });
  describe(`getTilesAccross()`, () => {
    it(`should return the current number of tiles across on the map`, () => {
      const expectedValue = 32;
      testMap.tilesAccross = 32;
      expect(testMap.getTilesAccross()).toEqual(expectedValue);
    });
  });
  describe(`setTilesDown(amount)`, () => {
    it(`should set the number of tiles vertically down the map with a given integer value`, () => {
      testMap.tilesDown = 32;
      const expectedValue = 16;
      testMap.setTilesDown(16);
      expect(testMap.tilesDown).toEqual(expectedValue);
    });
  });
  describe(`getTilesDown()`, () => {
    it(`should return the current number of tiles across on the map`, () => {
      const expectedValue = 32;
      testMap.tilesDown = 32;
      expect(testMap.getTilesDown()).toEqual(expectedValue);
    });
  });
  describe(`getAllProperties()`, () => {});
  describe(`createBlankModel(name, tileWidth, tileHeight, tilesAccross, tilesDown)`, () => {});
  describe(`createModelFromJSONString(json)`, () => {});
  describe(`serialize()`, () => {});
  describe(`destructModel()`, () => {});
  describe(`modifyTile(layer, x, y, options)`, () => {});
  describe(`getTile(layer, x, y)`, () => {});
  describe(`resizeMap(specifications)`, () => {});
  describe(`getWorldWidth()`, () => {});
  describe(`getWorldHeight()`, () => {});
});
