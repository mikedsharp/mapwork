import { Layer } from './mapwork.model.layer'
import { Map } from './mapwork.model.map'

let testLayer = null
const mockEditorEnvironment = {
  PalletCanvasResize: jest.fn(() => {
    return
  }),
}
describe(`mapwork.model.layer.js Layer object`, () => {
  beforeEach(() => {
    testLayer = new Layer(mockEditorEnvironment)
  })
  describe(`constructor`, () => {
    it(`should instantiate with some sensible defaults`, () => {
      expect(testLayer.name).toBeNull()
      expect(testLayer.tilesetPath).toBeNull()
      expect(testLayer.tilesetImage).toBeNull()
      expect(testLayer.rows.length).toEqual(0)
      expect(testLayer.zPosition).toBeNull()
      expect(testLayer.properties.length).toEqual(0)
      expect(testLayer.tilesetHeight).toBeNull()
      expect(testLayer.tilesetWidth).toBeNull()
      expect(testLayer.visible).toBe(true)
    })
  })
  describe(`setName(layerName)`, () => {
    it(`should set the name of the layer`, () => {
      const expectedName = 'newName'
      testLayer.setName(expectedName)
      expect(testLayer.name).toEqual(expectedName)
    })
  })
  describe(`getName()`, () => {
    it(`should get the name of the layer`, () => {
      const expectedName = 'layerName'
      testLayer.name = expectedName
      expect(testLayer.getName()).toEqual(expectedName)
    })
  })
  describe(`setTilesetPath(path)`, () => {
    let setTilesetImageSpy = null
    beforeEach(() => {
      jest.clearAllMocks()
      setTilesetImageSpy = jest
        .spyOn(testLayer, 'setTilesetImage')
        .mockImplementation(() => {})
    })
    it(`should set the path of the layers tileset image`, () => {
      const newPath = 'new/path.png'
      testLayer.setTilesetPath(newPath)
      expect(testLayer.tilesetPath).toEqual(newPath)
    })
    it(`setTilesetImage() should be called to update image with new path`, () => {
      const newPath = 'new/path.png'
      testLayer.setTilesetPath(newPath)
      expect(setTilesetImageSpy).toHaveBeenCalledWith(newPath)
      expect(setTilesetImageSpy).toHaveBeenCalledTimes(1)
    })
  })
  describe(`getVisibility()`, () => {
    it(`should return the visibility of the layer (false)`, () => {
      testLayer.visible = false
      expect(testLayer.getVisibility()).toBe(false)
    })
    it(`should return the visibility of the layer (true)`, () => {
      testLayer.visible = true
      expect(testLayer.getVisibility()).toBe(true)
    })
  })
  describe(`setVisibility(visible)`, () => {
    it(`should set the visibility to false`, () => {
      testLayer.setVisibility(false)
      expect(testLayer.visible).toBe(false)
    })
    it(`should set the visibility to true`, () => {
      testLayer.setVisibility(true)
      expect(testLayer.visible).toBe(true)
    })
  })
  describe(`getTilesetWidth()`, () => {
    it(`should return the tilesetWidth of the layer`, () => {
      const expectedWidth = 32
      testLayer.tilesetWidth = expectedWidth
      expect(testLayer.getTilesetWidth()).toEqual(expectedWidth)
    })
  })
  describe(`getTilesetHeight()`, () => {
    it(`should return the tilesetWidth of the layer`, () => {
      const expectedHeight = 32
      testLayer.tilesetHeight = expectedHeight
      expect(testLayer.getTilesetHeight()).toEqual(expectedHeight)
    })
  })
  describe(`setTilesetImage(path)`, () => {
    // TODO
    it(`should create a DOM image to render to the canvas`, () => {
      const expectedPath = 'a/path.png'
      testLayer.setTilesetImage(expectedPath)
      expect(testLayer.tilesetImage).toBeDefined()
      expect(testLayer.tilesetImage.src.endsWith).toBeTruthy()
    })
  })
  describe(`getTilesetPath()`, () => {
    it(`should return the tilesetPath of the layer`, () => {
      const expectedTilesetPath = 'the/path.png'
      testLayer.tilesetPath = expectedTilesetPath
      expect(testLayer.getTilesetPath()).toEqual(expectedTilesetPath)
    })
  })
  describe(`getTilesetImage()`, () => {
    it(`should return the layers tilesetImage`, () => {
      const expectedImage = new Image()
      testLayer.tilesetImage = expectedImage
      const result = testLayer.getTilesetImage()
      expect(result).toBeDefined()
      expect(result).toEqual(expectedImage)
    })
  })
  describe(`setZPosition(value)`, () => {
    it(`should set the Z position of the layer`, () => {
      testLayer.setZPosition(2)
      expect(testLayer.zPosition).toEqual(2)
    })
  })
  describe(`getZPosition()`, () => {
    it(`should return the zPosition of the layer`, () => {
      testLayer.zPosition = 5
      expect(testLayer.getZPosition()).toEqual(5)
    })
  })
  describe(`addRow(row)`, () => {
    it(`should add a row to list of layers row of tiles`, () => {
      testLayer.rows = [[{}, {}, {}]]
      const expectedRow = [{}, {}, {}]
      testLayer.addRow(expectedRow)
      expect(testLayer.rows.length).toEqual(2)
      expect(testLayer.rows[1]).toEqual(expectedRow)
    })
  })
  describe(`getRows()`, () => {
    it(`should retrieve rows for layer`, () => {
      const expectedRows = [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ]
      testLayer.rows = expectedRows
      expect(testLayer.getRows().length).toEqual(3)
      expect(testLayer.getRows()).toEqual(expectedRows)
    })
  })
  describe(`getTile(x, y)`, () => {
    it(`should retrieve a tile from the layer at a given (x,y) co-ordinate`, () => {
      const expectedTile = {
        a: 1,
        b: 2,
      }
      testLayer.rows = [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, expectedTile],
      ]
      expect(testLayer.getTile(2, 3)).toEqual(expectedTile)
    })
    it(`should return null because the tile referenced is out of range`, () => {
      testLayer.rows = [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ]
      expect(testLayer.getTile(55, -777)).toBeNull()
    })
  })
  describe(`getRow(index)`, () => {
    it(`should return a row at a given index of the layers rows`, () => {
      const expectedRow = [{ a: 1 }, { a: 2 }, { a: 3 }]
      testLayer.rows = [[{}, {}, {}], [{}, {}, {}], expectedRow, [{}, {}, {}]]
      expect(testLayer.getRow(2)).toEqual(expectedRow)
    })

    it(`should return null because the requested row is out of range`, () => {
      testLayer.rows = [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ]
      expect(testLayer.getRow(777)).toBeNull()
    })
  })
  describe(`removeProperty(key)`, () => {
    it(`should remove the property from the layer with a specified key`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'c', value: 3 },
      ]
      testLayer.properties = originalProperties
      testLayer.removeProperty('b')
      expect(testLayer.properties).toEqual(expectedProperties)
    })
    it(`should not make any changes, as the key doesn't exist`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      testLayer.properties = originalProperties
      testLayer.removeProperty('f')
      expect(testLayer.properties).toEqual(expectedProperties)
    })
  })
  describe(`setProperty(property)`, () => {
    it(`should change the value of an existing property within the layer`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 7 },
        { key: 'c', value: 3 },
      ]
      testLayer.properties = originalProperties
      testLayer.setProperty({
        oldKey: 'b',
        newKey: 'b',
        newValue: 7,
      })
      expect(testLayer.properties).toEqual(expectedProperties)
    })
    it(`should not change any values because the key doesn't exist`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      testLayer.properties = originalProperties
      testLayer.setProperty({
        oldKey: 'x',
        newKey: 'x',
        newValue: 7,
      })
      expect(testLayer.properties).toEqual(expectedProperties)
    })
  })
  describe(`getProperty(key)`, () => {
    it(`should return a property on the layer with a given key`, () => {
      testLayer.properties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      const expectedProperty = 2
      expect(testLayer.getProperty('b')).toEqual(expectedProperty)
    })
    it(`shouldn't return anything because the specified key doesn't exist`, () => {
      testLayer.properties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      expect(testLayer.getProperty('x')).not.toBeDefined()
    })
  })
  describe(`addProperty(prop)`, () => {
    it(`should add a given property to the layer`, () => {
      const originalProperties = [
        { key: 'a', value: 1 },
        { key: 'c', value: 3 },
      ]
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'c', value: 3 },
        { key: 'b', value: 2 },
      ]
      testLayer.properties = originalProperties
      testLayer.addProperty({ key: 'b', value: 2 })
      expect(testLayer.properties).toEqual(expectedProperties)
    })
  })
  describe(`getAllProperties()`, () => {
    it(`should return all properties of the layer untransformed`, () => {
      const expectedProperties = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
      testLayer.properties = expectedProperties
      expect(testLayer.getAllProperties()).toEqual(expectedProperties)
    })
  })
  describe(`createBlankModelLayer(map, layerName, tilesetPath)`, () => {
    it(`set up a new layer with sensible defaults to start editing the layer`, () => {
      const setNameSpy = jest.spyOn(testLayer, 'setName')
      const setTilesetPathSpy = jest.spyOn(testLayer, 'setTilesetPath')
      const setZPositionSpy = jest.spyOn(testLayer, 'setZPosition')
      const addRowSpy = jest.spyOn(testLayer, 'addRow')

      const layerName = 'new-layer'
      const tilesetPath = 'some/path.png'
      const map = new Map(mockEditorEnvironment)
      map.setTilesAccross(3)
      map.setTilesDown(4)
      testLayer.createBlankModelLayer(map, layerName, tilesetPath)

      expect(setNameSpy).toHaveBeenCalledWith(layerName)
      expect(setTilesetPathSpy).toHaveBeenCalledWith(tilesetPath)
      expect(setZPositionSpy).toHaveBeenCalledWith(0)
      expect(testLayer.rows.length).toEqual(4)
      expect(testLayer.rows[0].length).toEqual(3)
      expect(addRowSpy).toHaveBeenCalledTimes(4)
    })
  })
  describe(`createModelLayerFromJSONObject(map, json)`, () => {
    it(`set up a new layer with sensible defaults to start editing the layer`, () => {
      const setNameSpy = jest.spyOn(testLayer, 'setName')
      const setTilesetPathSpy = jest.spyOn(testLayer, 'setTilesetPath')
      const setZPositionSpy = jest.spyOn(testLayer, 'setZPosition')
      const addRowSpy = jest.spyOn(testLayer, 'addRow')
      const addPropertySpy = jest.spyOn(testLayer, 'addProperty')

      const layerName = 'new-layer'
      const tilesetPath = 'some/path.png'
      const map = new Map(mockEditorEnvironment)
      const json = {
        tilesetPath: tilesetPath,
        name: layerName,
        zPosition: 2,
        properties: [{ key: 'a', value: 'b' }],
        rows: [{ cells: [] }, { cells: [] }, { cells: [] }],
      }
      testLayer.createModelLayerFromJSONObject(map, json)

      expect(setNameSpy).toHaveBeenCalledWith(json.name)
      expect(setTilesetPathSpy).toHaveBeenCalledWith(json.tilesetPath)
      expect(setZPositionSpy).toHaveBeenCalledWith(json.zPosition)
      expect(addRowSpy).toHaveBeenCalledTimes(3)
      expect(addPropertySpy).toHaveBeenCalledTimes(1)
    })
  })
})
