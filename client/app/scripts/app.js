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
      .when('/memos/:id*/edit', {
        templateUrl: 'views/memoEdit.html',
        controller: 'MemoEditCtrl'
      })
      .when('/memos/:id*', {
        templateUrl: 'views/memo.html',
        controller: 'MemoCtrl'
      })
      .when('/memos', {
        templateUrl: 'views/memos.html',
        controller: 'MemosCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
