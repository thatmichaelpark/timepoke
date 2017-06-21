(function() {
  'use strict';

  const app = angular.module('timepokeApp');

  app.config(($routeProvider) => {
    $routeProvider
    .when('/', {
      templateUrl: 'partials/start.html'
    })
    .when('/shops', {
      templateUrl: 'partials/shops.html',
      controller: 'ShopsController',
      controllerAs: 'shopsController'
    })
    .when('/resources', {
      templateUrl: 'partials/resources.html',
      controller: 'ResourcesController',
      controllerAs: 'resourcesController'
    })
    .when('/memberslist', {
      templateUrl: 'partials/memberslist.html',
      controller: 'MembersListController',
      controllerAs: 'membersListController'
    })
    .when('/summary', {
      templateUrl: 'partials/summary.html',
      controller: 'SummaryController',
      controllerAs: 'summaryController'
    })
    .when('/report', {
      templateUrl: 'partials/report.html',
      controller: 'ReportController',
      controllerAs: 'reportController'
    })
  });
})();
