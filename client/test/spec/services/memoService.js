'use strict';

describe('Service: Memoservice', function () {

  // load the service's module
  beforeEach(module('memoApp'));

  // instantiate service
  var Memoservice;
  beforeEach(inject(function (_Memoservice_) {
    Memoservice = _Memoservice_;
  }));

  it('should do something', function () {
    expect(!!Memoservice).toBe(true);
  });

});
