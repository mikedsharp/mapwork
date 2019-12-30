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
      expect(testMap.createdTimestamp).toEqual(null);
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
  describe(`swapLayers(zPositionOne, zPositionTwo)`, () => {});
  describe(`setLayer(layer, index)`, () => {});
  describe(`setName(mapName)`, () => {});
  describe(`getName()`, () => {});
  describe(`setCreatedTimestamp(timestamp)`, () => {});
  describe(`getCreatedTimestamp()`, () => {});
  describe(`setTileWidth(amount)`, () => {});
  describe(`getTileWidth()`, () => {});
  describe(`setTileHeight(amount)`, () => {});
  describe(`getTileHeight()`, () => {});
  describe(`setTilesAccross(amount)`, () => {});
  describe(`getTilesAccross()`, () => {});
  describe(`setTilesDown(amount)`, () => {});
  describe(`getTilesDown()`, () => {});
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
