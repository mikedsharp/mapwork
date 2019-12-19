// for when we have real modules
//import './mapwork.viewcontroller.js';

describe('mapwork.viewcontroller.js', () => {
  describe('Init', () => {
    // this structure will work when I turn the project into proper modules
    // it('Should call InitateRenderLoop function once', () => {
    //   const spy = jest.fn();
    //   jest
    //     .spyOn(window.mapwork.viewcontroller, 'InitiateRenderLoop')
    //     .mockImplementation(() => {});
    //   expect(spy).toHaveBeenCalledTimes(1);
    // });
    // for now we just do a basic check on an object to prove the test framework is
    // functioning correctly
    it('true should be true', () => {
      expect(true).toBe(true);
    });
  });
});
