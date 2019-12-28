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
  describe('setTilesheetX(value)', () => {
    it(`should set tilesheetX value to 0`, function() {
      testTile.setTilesheetX(0);
      expect(testTile.tilesheetX).toEqual(0);
    });
    it(`should set tilesheetX value to 1`, function() {
      testTile.setTilesheetX(1);
      expect(testTile.tilesheetX).toEqual(1);
    });
    it(`should set tilesheetX value to 999`, function() {
      testTile.setTilesheetX(999);
      expect(testTile.tilesheetX).toEqual(999);
    });
    it(`should set tilesheetX value to -1`, function() {
      testTile.setTilesheetX(-1);
      expect(testTile.tilesheetX).toEqual(-1);
    });
  });
  describe('getTilesheetX()', () => {
    it(`should return tilesheetX value`, () => {
      testTile.tilesheetX = 999;
      expect(testTile.getTilesheetX()).toEqual(999);
    });
  });
  describe('setTilesheetY(value)', () => {
    it(`should set tilesheetY value to 0`, function() {
      testTile.setTilesheetY(0);
      expect(testTile.tilesheetY).toEqual(0);
    });
    it(`should set tilesheetY value to 1`, function() {
      testTile.setTilesheetY(1);
      expect(testTile.tilesheetY).toEqual(1);
    });
    it(`should set tilesheetY value to 999`, function() {
      testTile.setTilesheetY(999);
      expect(testTile.tilesheetY).toEqual(999);
    });
    it(`should set tilesheetY value to -1`, function() {
      testTile.setTilesheetY(-1);
      expect(testTile.tilesheetY).toEqual(-1);
    });
  });
  describe('getTilesheetY()', () => {
    it(`should return tilesheetY value`, () => {
      testTile.tilesheetY = 999;
      expect(testTile.getTilesheetY()).toEqual(999);
    });
  });
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
  describe('removeProperty(key)', () => {
    it(`should remove property with specified key (middle value removed)`, () => {
      testTile.properties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      const expectedProperties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      testTile.removeProperty('b');
      expect(testTile.properties.length).toEqual(2);
      expect(testTile.properties).toEqual(expectedProperties);
    });

    it(`should remove property with specified key (last value removed)`, () => {
      testTile.properties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      const expectedProperties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        }
      ];
      testTile.removeProperty('c');
      expect(testTile.properties.length).toEqual(2);
      expect(testTile.properties).toEqual(expectedProperties);
    });

    it(`should remove property with specified key (first value removed)`, () => {
      testTile.properties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      const expectedProperties = [
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      testTile.removeProperty('a');
      expect(testTile.properties.length).toEqual(2);
      expect(testTile.properties).toEqual(expectedProperties);
    });
  });
  describe('setProperty(property)', () => {
    it(`should change existing property 'b' with new value 'hello'`, () => {
      testTile.properties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      const expectedProperties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'hello'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      testTile.setProperty({
        oldKey: 'b',
        newKey: 'b',
        newValue: 'hello'
      });
      expect(testTile.properties).toEqual(expectedProperties);
    });

    it(`should change nothing, because the key doesn't exist`, () => {
      testTile.properties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      const expectedProperties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      testTile.setProperty({
        oldKey: 'z',
        newKey: 'z',
        newValue: 'hellouoooo'
      });
      expect(testTile.properties).toEqual(expectedProperties);
    });
  });
  describe('getProperty(key)', () => {
    it(`should retrieve the property requested by key`, () => {
      testTile.properties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      const expectedProperty = 'other thing';
      expect(testTile.getProperty('b')).toEqual(expectedProperty);
    });
  });
  describe('getAllProperties()', () => {
    it(`should return all of a tiles properties, un transformed`, () => {
      testTile.properties = [
        {
          key: 'a',
          value: 'thing'
        },
        {
          key: 'b',
          value: 'other thing'
        },
        {
          key: 'c',
          value: 'third thing'
        }
      ];
      expect(testTile.getAllProperties()).toEqual(testTile.properties);
    });
  });
  describe('createBlankModelTile()', () => {
    it(`should call setTileCode with an argument of '-1'`, () => {
      const spy = jest.spyOn(testTile, 'setTileCode');
      testTile.createBlankModelTile();
      expect(spy).toHaveBeenCalledWith(-1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
