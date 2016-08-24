'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('medicationReminderApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;

    var start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    $httpBackend.expectGET('/api/medications?start=' + start + '&end=' + end)
      .respond(['completed', 'time', 'dosage', 'name']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.meds.length).toBe(4);
  });
});

describe('Testing PUT method', function () {

  // load the controller's module
  beforeEach(module('medicationReminderApp'));

  var UpdateMedCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;

    $httpBackend.when('PUT', '/api/medications/57bb2797d9a7c24a74b6fd5c')
      .respond(['completed', 'time', 'dosage', 'name']);

    scope = $rootScope.$new();

    UpdateMedCtrl = $controller('UpdateMedCtrl', {
      '$scope': scope
    });
  }));

  it('should be able to request PUT and get response back', function () {

    var m = {
      object: '106',
      _id: '57bb2797d9a7c24a74b6fd5c',
      dosage: '200 mL',
      name: 'Medication 20',
      time: '2016-08-25T01:49:05.454Z'
    }

    // updateMeds function performs PUT request
    scope.updateMeds(m);

    // Execute PUT request
    $httpBackend.flush();
    expect(scope.meds.length).toBe(4);
  });
});