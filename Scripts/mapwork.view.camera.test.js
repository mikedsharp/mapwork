import { Camera } from './mapwork.view.camera';

describe(`mapwork.view.camera - Canvas Camera object`, () => {
  let testCamera;
  let MockMapModel;
  beforeEach(() => {
    MockMapModel = {
      getWorldWidth: () => 1024,
      getWorldHeight: () => 768
    };
    testCamera = new Camera(MockMapModel);
  });
  describe(`constructor`, () => {
    it(`Should provide a sensible list of constructor defaults`, () => {
      // check dependencies
      expect(testCamera.MapModel).toEqual(MockMapModel);
      // check defaults
      expect(testCamera.x).toEqual(0);
      expect(testCamera.y).toEqual(0);
      expect(testCamera.width).toEqual(0);
      expect(testCamera.height).toEqual(0);
      expect(testCamera.maxY).toEqual(null);
      expect(testCamera.maxX).toEqual(null);
    });
  });
  describe(`setupCamera(x, y, width, height, maxX, maxY)`, () => {
    it(`Should provide new starting co-ordinates`, () => {
      const expectedX = 50;
      const expectedY = 100;
      const expectedWidth = 128;
      const expectedHeight = 64;
      const expectedMaxX = 1024;
      const expectedMaxY = 768;

      testCamera.setupCamera(
        expectedX,
        expectedY,
        expectedWidth,
        expectedHeight,
        expectedMaxX,
        expectedMaxY
      );

      expect(testCamera.x).toEqual(expectedX);
      expect(testCamera.y).toEqual(expectedY);
      expect(testCamera.width).toEqual(expectedWidth);
      expect(testCamera.height).toEqual(expectedHeight);
      expect(testCamera.maxX).toEqual(expectedMaxX);
      expect(testCamera.maxY).toEqual(expectedMaxY);
    });
  });
  describe(`getX()`, () => {
    it(`should return Camera x value`, () => {
      const expectedX = 55;
      testCamera.x = expectedX;
      expect(testCamera.getX()).toEqual(expectedX);
    });
  });
  describe(`getY()`, () => {
    it(`should return Camera y value`, () => {
      const expectedY = 55;
      testCamera.y = expectedY;
      expect(testCamera.getY()).toEqual(expectedY);
    });
  });
  describe(`getWidth()`, () => {
    it(`should return Camera width value`, () => {
      const expectedWidth = 128;
      testCamera.width = expectedWidth;
      expect(testCamera.getWidth()).toEqual(expectedWidth);
    });
  });
  describe(`getHeight()`, () => {
    it(`should return Camera height value`, () => {
      const expectedHeight = 128;
      testCamera.height = expectedHeight;
      expect(testCamera.getHeight()).toEqual(expectedHeight);
    });
  });
  describe(`getMaxX()`, () => {
    it(`should return Camera maxX value`, () => {
      const expectedMaxX = 128;
      testCamera.maxX = expectedMaxX;
      expect(testCamera.getMaxX()).toEqual(expectedMaxX);
    });
  });
  describe(`getMaxY()`, () => {
    it(`should return Camera maxY value`, () => {
      const expectedMaxY = 128;
      testCamera.maxY = expectedMaxY;
      expect(testCamera.getMaxY()).toEqual(expectedMaxY);
    });
  });
  describe(`setX(x)`, () => {
    it(`should set the x value of the Camera`, () => {
      const expectedX = 55;
      testCamera.setX(expectedX);
      expect(testCamera.x).toEqual(expectedX);
    });
  });
  describe(`setY(y)`, () => {
    it(`should set the y value of the Camera`, () => {
      const expectedY = 55;
      testCamera.setY(expectedY);
      expect(testCamera.y).toEqual(expectedY);
    });
  });
  describe(`setWidth(width)`, () => {
    it(`should set the width value of the Camera`, () => {
      const expectedWidth = 55;
      testCamera.setWidth(expectedWidth);
      expect(testCamera.width).toEqual(expectedWidth);
    });
  });
  describe(`setHeight(height)`, () => {
    it(`should set the height value of the Camera`, () => {
      const expectedHeight = 55;
      testCamera.setHeight(expectedHeight);
      expect(testCamera.height).toEqual(expectedHeight);
    });
  });
  describe(`setPosition(x, y)`, () => {
    it(`should set x position to desired x position`, () => {
      testCamera.maxX = 1024;
      testCamera.maxY = 768;
      const expectedX = 33;
      const x = 33;
      testCamera.setPosition(x, testCamera.y);
      expect(testCamera.x).toEqual(expectedX);
    });
    it(`should set x position to 0 because x position provided is negative`, () => {
      // modified so the test initially fails
      testCamera.maxX = 1024;
      testCamera.maxY = 768;
      testCamera.x = 32;
      const expectedX = 0;
      const x = -32;
      testCamera.setPosition(x, testCamera.y);
      expect(testCamera.x).toEqual(expectedX);
    });
    it(`should set x position to edge of map X minus the width of the camera because camera has exceeded bounds`, () => {
      testCamera.width = 32;
      testCamera.maxX = 1024;
      testCamera.maxY = 768;
      const expectedX = testCamera.maxX - testCamera.width;
      const excessiveX = testCamera.maxX + testCamera.width;
      testCamera.setPosition(excessiveX, testCamera.y);
      expect(testCamera.x).toEqual(expectedX);
    });
    it(`should set y position to desired y position`, () => {
      testCamera.maxX = 1024;
      testCamera.maxY = 768;
      const expectedY = 33;
      const y = 33;
      testCamera.setPosition(testCamera.x, y);
      expect(testCamera.y).toEqual(expectedY);
    });
    it(`should set y position to 0 because y position provided is negative`, () => {
      // modified so the test initially fails
      testCamera.maxX = 1024;
      testCamera.maxY = 768;
      testCamera.y = 32;
      const expectedY = 0;
      const y = -32;
      testCamera.setPosition(testCamera.x, y);
      expect(testCamera.y).toEqual(expectedY);
    });
    it(`should set y position to edge of map Y minus the height of the camera because camera has exceeded bounds`, () => {
      testCamera.width = 32;
      testCamera.maxX = 1024;
      testCamera.maxY = 768;
      const expectedY = testCamera.maxY - testCamera.height;
      const excessiveY = testCamera.maxY + testCamera.height;
      testCamera.setPosition(testCamera.x, excessiveY);
      expect(testCamera.y).toEqual(expectedY);
    });
  });
  describe(`setSize(width, height)`, () => {
    it(`should set the width, and not cull it because the new width < world width`, () => {
      const expectedWidth = 32;
      testCamera.setSize(expectedWidth, testCamera.height);
      expect(testCamera.width).toEqual(expectedWidth);
    });
    it(`should set the height, and not cull it because the new height < world height`, () => {
      const expectedHeight = 32;
      testCamera.setSize(testCamera.width, expectedHeight);
      expect(testCamera.height).toEqual(expectedHeight);
    });
    it(`should set the height and width, and not cull it because the new width < world width and new height < world height`, () => {
      const expectedWidth = 32;
      const expectedHeight = 32;
      testCamera.setSize(expectedWidth, expectedHeight);
      expect(testCamera.height).toEqual(expectedWidth);
      expect(testCamera.height).toEqual(expectedHeight);
    });
    it(`should set the width, but cull it because the new width > world width`, () => {
      const excessiveWidth = testCamera.MapModel.getWorldWidth() + 32;
      const expectedWidth = testCamera.MapModel.getWorldWidth();
      testCamera.setSize(excessiveWidth, testCamera.height);
      expect(testCamera.width).toEqual(expectedWidth);
    });
    it(`should set the height, but cull it because the new height > world height`, () => {
      const excessiveHeight = testCamera.MapModel.getWorldHeight() + 32;
      const expectedHeight = testCamera.MapModel.getWorldHeight();
      testCamera.setSize(testCamera.width, excessiveHeight);
      expect(testCamera.height).toEqual(expectedHeight);
    });
    it(`should set the height and width, and cull it because the new width > world width and new height > world height`, () => {
      const excessiveWidth = testCamera.MapModel.getWorldWidth() + 32;
      const excessiveHeight = testCamera.MapModel.getWorldHeight() + 32;
      const expectedWidth = testCamera.MapModel.getWorldWidth();
      const expectedHeight = testCamera.MapModel.getWorldHeight();
      testCamera.setSize(excessiveWidth, excessiveHeight);
      expect(testCamera.width).toEqual(expectedWidth);
      expect(testCamera.height).toEqual(expectedHeight);
    });

    it(`should set the height and width, should cull width because its larger than world width, but not cull height because its less than world height`, () => {
      const excessiveWidth = testCamera.MapModel.getWorldWidth() + 32;
      const expectedWidth = testCamera.MapModel.getWorldWidth();
      const expectedHeight = 55;
      testCamera.setSize(excessiveWidth, expectedHeight);
      expect(testCamera.width).toEqual(expectedWidth);
      expect(testCamera.height).toEqual(expectedHeight);
    });

    it(`should set the height and width, should cull height because its larger than world height, but not cull width because its less than world width`, () => {
      const expectedWidth = 55;
      const excessiveHeight = testCamera.MapModel.getWorldHeight() + 32;
      const expectedHeight = testCamera.MapModel.getWorldHeight();
      testCamera.setSize(expectedWidth, excessiveHeight);
      expect(testCamera.width).toEqual(expectedWidth);
      expect(testCamera.height).toEqual(expectedHeight);
    });
  });
  describe(`setBounds(maxX, maxY)`, () => {
    it(`should set the maxX and maxY of the Camera`, () => {
      const expectedMaxX = 1024;
      const expectedMaxY = 768;
      testCamera.setBounds(expectedMaxX, expectedMaxY);
      expect(testCamera.maxX).toEqual(expectedMaxX);
      expect(testCamera.maxY).toEqual(expectedMaxY);
    });
  });
  describe(`move(direction, amount)`, () => {
    it(`should move left by 20 pixels because camera is in bounds after move`, () => {
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 50;
      testCamera.y = 50;
      const expectedX = testCamera.x - 20;
      testCamera.move('left', 20);
      expect(testCamera.x).toEqual(expectedX);
    });
    it(`should move right by 20 pixels because camera is in bounds after move`, () => {
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 50;
      testCamera.y = 50;
      const expectedX = testCamera.x + 20;
      testCamera.move('right', 20);
      expect(testCamera.x).toEqual(expectedX);
    });
    it(`should move up by 20 pixels because camera is in bounds after move`, () => {
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 50;
      testCamera.y = 50;
      const expectedY = testCamera.y - 20;
      testCamera.move('up', 20);
      expect(testCamera.y).toEqual(expectedY);
    });
    it(`should move down by 20 pixels because camera is in bounds after move`, () => {
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 50;
      testCamera.y = 50;
      const expectedY = testCamera.y + 20;
      testCamera.move('down', 20);
      expect(testCamera.y).toEqual(expectedY);
    });

    it(`should move left by 18 pixels despite amount being 20 because camera will hit minimum bounds`, () => {
      const desiredX = 20;
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 18;
      testCamera.y = 50;
      testCamera.move('left', desiredX);
      expect(testCamera.x).toEqual(0);
    });
    it(`should move right by 18 pixels despite amount being 20 because maximum x bounds will be hit`, () => {
      const desiredX = 20;
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 88;
      testCamera.y = 50;
      testCamera.move('right', desiredX);
      expect(testCamera.x).toEqual(100);
    });
    it(`should move up by 18 pixels despite amount being 20 because camera will hit minimum bounds`, () => {
      const desiredY = 20;
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 88;
      testCamera.y = 18;
      testCamera.move('up', desiredY);
      expect(testCamera.y).toEqual(0);
    });
    it(`should move down by 18 pixels despite amount being 20 because maximum y bounds will be hit`, () => {
      const desiredY = 20;
      testCamera.maxX = 100;
      testCamera.maxY = 200;
      testCamera.x = 88;
      testCamera.y = 188;
      testCamera.move('down', desiredY);
      expect(testCamera.y).toEqual(200);
    });
  });
});
