// test for app.js

// by default all functionions that are required are mocked. Have to specify what is not mocked
jest.dontMock('../src/app');

describe('App', function() {
  it('should have a render method', function() {
    var sum = require('../src/app');

    expect(sum(1,2)).toBe(3);
  });
});