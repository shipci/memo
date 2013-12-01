'use strict';

angular.module('memoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'memoFilters'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/memos', {
        templateUrl: 'views/memos.html',
        controller: 'MemoCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
