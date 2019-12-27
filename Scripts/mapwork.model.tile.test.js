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
});
