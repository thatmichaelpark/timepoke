(function() {
  'use strict';

  const app = angular.module('adminApp');

  app.config(($routeProvider) => {
    $routeProvider
    .when('/members', {
      templateUrl: 'partials/admin-members.html',
      controller: `MembersController`,
      controllerAs: `membersController`
    })
    .when('/logins', {
      templateUrl: 'partials/admin-logins.html',
      controller: `LoginsController`,
      controllerAs: `loginsController`
    })
    .when('/shops', {
      templateUrl: 'partials/admin-shops.html',
      controller: `ShopsController`,
      controllerAs: `shopsController`
    })
    .when('/items', {
      templateUrl: 'partials/admin-items.html',
      controller: `ItemsController`,
      controllerAs: `itemsController`
    })
    .when('/reports', {
      templateUrl: 'partials/admin-reports.html',
      controller: `ReportsController`,
      controllerAs: `reportsController`
    })
  });
})();
