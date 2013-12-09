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
      .when('/memos/:file*.md/edit', {
        templateUrl: 'views/memoEdit.html',
        controller: 'MemoEditCtrl'
      })
      .when('/memos/:file*.md', {
        templateUrl: 'views/memo.html',
        controller: 'MemoCtrl'
      })
      .when('/memos/:dir*', {
        templateUrl: 'views/memos.html',
        controller: 'MemosCtrl'
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
