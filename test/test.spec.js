var mocks = require('./mocks');
var appTest = require('../src/js/test');

var myApp, myTestVariable='test';

describe('A test test scenario', function() {
	describe('inner suite here', function() {
		
		myApp = new appTest(myTestVariable)
		
		it('should assert true things', function() {
		expect(true).toBe(true);
		});
		it('should have thest match', function() {
			expect(myApp.test).toBe(myTestVariable);
		});
		it('should have mocks', function() {
			expect(mocks).toBeDefined();
		});
	});
	
});