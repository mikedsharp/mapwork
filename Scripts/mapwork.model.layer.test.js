import { Layer } from './mapwork.model.layer';

let testLayer = null;
const mockEditorEnvironment = {
  PalletCanvasResize: jest.fn(() => {
    return;
  })
};
describe(`mapwork.model.layer.js Layer object`, () => {
  beforeEach(() => {
    testLayer = new Layer(mockEditorEnvironment);
  });
  describe(`constructor`, () => {
    it(`should instantiate with some sensible defaults`, () => {
      expect(testLayer.name).toBeNull();
      expect(testLayer.tilesetPath).toBeNull();
      expect(testLayer.tilesetImage).toBeNull();
      expect(testLayer.rows.length).toEqual(0);
      expect(testLayer.zPosition).toBeNull();
      expect(testLayer.properties.length).toEqual(0);
      expect(testLayer.tilesetHeight).toBeNull();
      expect(testLayer.tilesetWidth).toBeNull();
      expect(testLayer.visible).toBe(true);
    });
  });
  describe(`setName(layerName)`, () => {
    it(`should set the name of the layer`, () => {
      const expectedName = 'newName';
      testLayer.setName(expectedName);
      expect(testLayer.name).toEqual(expectedName);
    });
  });
  describe(`getName()`, () => {
    it(`should get the name of the layer`, () => {
      const expectedName = 'layerName';
      testLayer.name = expectedName;
      expect(testLayer.getName()).toEqual(expectedName);
    });
  });
  describe(`setTilesetPath(path)`, () => {
    let setTilesetImageSpy = null;
    beforeEach(() => {
      jest.clearAllMocks();
      setTilesetImageSpy = jest
        .spyOn(testLayer, 'setTilesetImage')
        .mockImplementation(() => {
          return;
        });
    });
    it(`should set the path of the layers tileset image`, () => {
      const newPath = 'new/path.png';
      testLayer.setTilesetPath(newPath);
      expect(testLayer.tilesetPath).toEqual(newPath);
    });
    it(`setTilesetImage() should be called to update image with new path`, () => {
      const newPath = 'new/path.png';
      testLayer.setTilesetPath(newPath);
      expect(setTilesetImageSpy).toHaveBeenCalledWith(newPath);
      expect(setTilesetImageSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe(`getVisibility()`, () => {});
  describe(`setVisibility(visible)`, () => {});
  describe(`getTilesetWidth()`, () => {});
  describe(`getTilesetHeight()`, () => {});
  describe(`setTilesetImage(path)`, () => {});
  describe(`getTilesetPath()`, () => {});
  describe(`getTilesetImage()`, () => {});
  describe(`setZPosition(value)`, () => {});
  describe(`getZPosition()`, () => {});
  describe(`addRow(row)`, () => {});
  describe(`getRows()`, () => {});
  describe(`getTile(x, y)`, () => {});
  describe(`getRow(index)`, () => {});
  describe(`removeProperty(key)`, () => {});
  describe(`setProperty(property)`, () => {});
  describe(`getProperty(key)`, () => {});
  describe(`addProperty(prop)`, () => {});
  describe(`getAllProperties()`, () => {});
  describe(`addProperty(prop)`, () => {});
  describe(`createBlankModelLayer(map, layerName, tilesetPath)`, () => {});
  describe(`createModelLayerFromJSONObject(map, json)`, () => {});
});
