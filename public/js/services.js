/* globals angular */
(function() {
  'use strict';

  const app = angular.module('monoculturedApp');

  // entry service collects the info for a time entry:
  // member id, hours, other items
  // and provides a post method to save a time entry.
  const entry = function($http) {
    const entriesServer = '/api/entries';
    const entryItemsServer = '/api/entries_items';
    return {
      memberId: 0,
      memberName: ``,
      shopId: 0,
      shopName: ``,
      hours: 0,
      items: [],
      post: (entry, callback) => {
        $http.post(entriesServer, { entry })
        .then((res) => {
          if (callback) {
            callback(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }
    };
  };

  app.factory('entry', entry);
  entry.$inject = ['$http'];

  const members = function($http) {
    const server = '/api/members';

    return {
      get: () =>
        $http.get(server)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      // delete: (id) =>
      //   $http.delete(`${server}/${id}`)
      //   .then((res) =>
      //     res.data
      //   )
      //   .catch((err) => {
      //     throw err;
      //   }),
      // patch: (id, data) =>
      //   $http.patch(`${server}/${id}`, data)
      //   .then((res) =>
      //     res.data
      //   )
      //   .catch((err) => {
      //     throw err;
      //   }),
      // login: (username, password) =>
      //   $http.post(tokenServer, { username, password })
      //   .then((res) =>
      //     res.data
      //   )
      //   .catch((err) => {
      //     throw err;
      //   })
    };
  };

  app.factory('members', members);
  members.$inject = ['$http'];

  const shops = function($http) {
    const server = '/api/shops';

    return {
      get: () =>
        $http.get(server)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      getItems: (id) =>
        $http.get(`${server}/${id}/items`)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
    };
  };

  app.factory('shops', shops);
  shops.$inject = ['$http'];

  // const puzzles = function($http) {
  //   const server = 'http://localhost:8000/api/puzzles';
  //
  //   return {
  //     get: () =>
  //       $http.get(server)
  //       .then((res) =>
  //         res.data
  //       )
  //       .catch((err) => {
  //         throw err;
  //       }),
  //     getOne: (id) =>
  //       $http.get(`${server}/${id}`)
  //       .then((res) =>
  //         res.data
  //       )
  //       .catch((err) => {
  //         throw err;
  //       }),
  //     delete: (id) =>
  //       $http.delete(`${server}/${id}`)
  //       .then((res) =>
  //         res.data
  //       )
  //       .catch((err) => {
  //         throw err;
  //       }),
  //     post: (data) =>
  //       $http.post(server, data)
  //       .then((res) =>
  //         res.data
  //       )
  //       .catch((err) => {
  //         throw err;
  //       }),
  //     patch: (id, data) =>
  //       $http.patch(`${server}/${id}`, data)
  //       .then((res) =>
  //         res.data
  //       )
  //       .catch((err) => {
  //         throw err;
  //       })
  //   };
  // };
  //
  // app.factory('puzzles', puzzles);
  // puzzles.$inject = ['$http'];
})();
