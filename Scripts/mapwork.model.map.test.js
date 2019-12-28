import { Map } from './mapwork.model.map';
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
  describe(`getProperty(key)`, () => {});
  describe(`addProperty(prop)`, () => {});
  describe(`getLayerByZPosition(zPosition)`, () => {});
  describe(`getLayer(index)`, () => {});
  describe(`getLayers()`, () => {});
  describe(`addLayer(layer)`, () => {});
  describe(`removeLayer(zPosition)`, () => {});
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
