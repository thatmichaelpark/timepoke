(function() {
  'use strict';

  const app = angular.module('monoculturedApp');

  app.config(($routeProvider) => {
    $routeProvider
    .when('/', {
      templateUrl: 'partials/memberslist.html',
      controller: 'MembersListController',
      controllerAs: 'membersListController'
    })
    .when('/hours', {
      templateUrl: 'partials/hours.html',
      controller: 'HoursController',
      controllerAs: 'hoursController'
    })
    .when('/items', {
      templateUrl: 'partials/items.html',
      controller: 'ItemsController',
      controllerAs: 'itemsController'
    })
    .when('/final', {
      templateUrl: 'partials/final.html',
      controller: 'FinalController',
      controllerAs: 'finalController'
    })
    // .when('/puzzlesform/:id', {
    //   templateUrl: 'partials/puzzlesform.html',
    //   controller: 'PuzzlesFormController',
    //   controllerAs: 'puzzlesFormController'
    // })
    // .when('/users', {
    //   templateUrl: 'partials/users.html',
    //   controller: 'UsersController',
    //   controllerAs: 'usersController'
    // })
    // .when('/usersform/:id', {
    //   templateUrl: 'partials/usersform.html',
    //   controller: 'UsersFormController',
    //   controllerAs: 'usersFormController'
    // });
  });
})();
