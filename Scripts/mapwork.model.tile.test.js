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
});
