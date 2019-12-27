import { Tile } from './mapwork.model.tile';
let testTile = null;
describe('mapwork.model.tile.js Tile object', () => {
  beforeEach(() => {
    testTile = new Tile();
  });
  describe('tile instantiated', () => {
    it('should be a newly instantiated tile with some sensible default values', () => {
      expect(testTile.tileCode).toEqual(-1);
      expect(testTile.tilesheetX).toBe(null);
      expect(testTile.tilesheetY).toBe(null);
      expect(testTile.properties).toEqual([]);
    });
  });
  describe('setTileCode(code)', () => {
    it('should set the Tiles tilecode to -1', () => {
      testTile.setTileCode(-1);
      expect(testTile.tileCode).toEqual(-1);
    });
    it('should set the Tiles tilecode to 0', () => {
      testTile.setTileCode(0);
      expect(testTile.tileCode).toEqual(0);
    });
    it('should set the Tiles tilecode to 1', () => {
      testTile.setTileCode(1);
      expect(testTile.tileCode).toEqual(1);
    });
    it('should set the Tiles tilecode to 999', () => {
      testTile.setTileCode(999);
      expect(testTile.tileCode).toEqual(999);
    });
    it("should reject new tilecode is it isn't a number", () => {
      const originalValue = testTile.tileCode;
      expect(() => {
        testTile.setTileCode('asdf');
      }).toThrow('TileCode must be a number');
      expect(testTile.tileCode).not.toEqual('asdf');
      expect(testTile.tileCode).toEqual(originalValue);
    });
  });
  describe('getTileCode()', () => {
    it(`should return tilecode of a given tile (-1)`, () => {
      testTile.tileCode = -1;
      expect(testTile.getTileCode()).toEqual(-1);
    });
    it(`should return tilecode of a given tile (0)`, () => {
      testTile.tileCode = 0;
      expect(testTile.getTileCode()).toEqual(0);
    });
    it(`should return tilecode of a given tile (1)`, () => {
      testTile.tileCode = 1;
      expect(testTile.getTileCode()).toEqual(1);
    });
    it(`should return tilecode of a given tile (9999)`, () => {
      testTile.tileCode = 9999;
      expect(testTile.getTileCode()).toEqual(9999);
    });
  });
  describe('setTilesheetX(value)', () => {});
  describe('getTilesheetX()', () => {});
  describe('setTilesheetY(value)', () => {});
  describe('getTilesheetY()', () => {});
  describe('addProperty(prop)', () => {
    it(`should save 'prop' as a new tile property`, () => {
      const singleTilePropertyFixture = {
        key: 'a',
        value: 3
      };
      testTile.addProperty(singleTilePropertyFixture);
      expect(testTile.properties[0]).toEqual(singleTilePropertyFixture);
      expect(testTile.properties.length).toEqual(1);
    });
    it(`should save 'prop' as a new tile property, there should be two items in properties`, () => {
      const singleTilePropertyFixture = {
        key: 'a',
        value: 3
      };
      const singleTilePropertyFixtureTwo = {
        key: 'b',
        value: 1
      };
      testTile.addProperty(singleTilePropertyFixture);
      testTile.addProperty(singleTilePropertyFixtureTwo);
      expect(testTile.properties[1]).toEqual(singleTilePropertyFixtureTwo);
      expect(testTile.properties.length).toEqual(2);
    });
  });
  describe('removeProperty(key)', () => {});
  describe('setProperty(property)', () => {});
  describe('getProperty(key)', () => {});
  describe('getAllProperties()', () => {});
  describe('createBlankModelTile()', () => {
    it(`should call setTileCode with an argument of '-1'`, () => {
      const spy = jest.spyOn(testTile, 'setTileCode');
      testTile.createBlankModelTile();
      expect(spy).toHaveBeenCalledWith(-1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
