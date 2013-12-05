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
      .when('/memos/:id*', {
        templateUrl: 'views/memo.html',
        controller: 'MemoCtrl'
      })
      .when('/memos', {
        templateUrl: 'views/memos.html',
        controller: 'MemosCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
