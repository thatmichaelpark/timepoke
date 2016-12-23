/* globals angular */
(function() {
  'use strict';

  const app = angular.module('monoculturedApp');

  const boo = function() {
    return {
      boo: (err) => {
        console.log(err);
        alert(err.statusText + (err.data ? ` (${err.data})` : ``));
      }
    };
  };

  app.factory('boo', boo);

  // entry service collects the info for a time entry:
  // member id, hours, other items
  // and provides a post method to save a time entry.
  const entry = function($http) {
    const entriesServer = '/api/entries';
    const entryItemsServer = '/api/entries_items';
    return {
      memberId: 0,
      memberName: ``,
      membershipTier: ``,
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
      getShops: (id) =>
        $http.get(`${server}/${id}/shops`)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      saveShops: (id, shopIds) =>
        $http.post(`${server}/${id}/shops`, { shopIds })
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      getEntries: (id) =>
        $http.get(`${server}/${id}/entries`)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      patch: (id, data) =>
        $http.patch(`${server}/${id}`, data)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      post: (data) =>
        $http.post(server, data)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        })
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
      getMembers: (shopId) =>
        $http.get(`${server}/${shopId}/members`)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      getItems: (shopId) =>
        $http.get(`/api/items/byshopid/${shopId}`)
        .then((res) =>
          res.data
        )
        .catch((err) => {
          throw err;
        }),
      patch: (data) =>
        $http.patch(`${server}/${data.id}`, data)
        .then((res) =>
          res.data
        )
    };
  };

  app.factory('shops', shops);
  shops.$inject = ['$http'];

  const logins = function($http) {
    const server = '/api/logins';

    return {
      get: () =>
        $http.get(server)
        .then((res) =>
          res.data
        ),
      post: (data) =>
        $http.post(server, data)
        .then((res) =>
          res.data
        ),
      patch: (data) =>
        $http.patch(`${server}/${data.id}`, data)
        .then((res) =>
          res.data
        )
    };
  };

  app.factory('logins', logins);
  logins.$inject = ['$http'];

  const items = function($http) {
    const server = '/api/items';

    return {
      get: () =>
        $http.get(server)
        .then((res) =>
          res.data
        ),
      post: (data) =>
        $http.post(server, data)
        .then((res) =>
          res.data
        ),
      patch: (data) =>
        $http.patch(`${server}/${data.id}`, data)
        .then((res) =>
          res.data
        )
    };
  };

  app.factory('items', items);
  items.$inject = ['$http'];

  const report = function($http) {

    return {
      get: () =>
        $http.get(`/api/entries/full`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw err;
        }),
    };
  };

  app.factory('report', report);
  report.$inject = ['$http'];

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
