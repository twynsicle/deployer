'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('deployer', [
  'ngRoute',
  'deployer.view1'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
