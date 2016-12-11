(function() {
  'use strict';

  angular.module('adminApp')
  .controller(`AdminController`, function() {
    this.logout = () => {
      alert('log out');
    };
  })
  .controller(`MembersController`, function(members) {
    this.showActiveOnly = true;

    this.filter = () => {
      return this.showActiveOnly ?
        { name: this.searchString, isActive: true } :
        { name: this.searchString };
    };

    members.get()
      .then(data => {
        this.members = data;
      })
      .catch(err => {
        console.log(err);
      });

    this.click = (member) => {
      if (member) {
        const { id, name, imageUrl, isActive } = member;
        this.form = { id, name, imageUrl, isActive };
      } else {
        this.form = {};
      }
      $(`#member-edit-modal`).modal({backdrop: `static`});
    };

    this.save = () => {
      $(`#member-edit-modal`).modal('hide');
      console.log(this.form);
    };
  })
  .controller(`LoginsController`, function(logins) {
    this.showActiveOnly = true;

    this.filter = () => {
      return this.showActiveOnly ?
        { loginName: this.searchString, isActive: true } :
        { loginName: this.searchString };
    };

    logins.get()
      .then(data => {
        this.logins = data;
      })
      .catch(err => {
        console.log(err);
      });

    this.click = (login) => {
      if (login) {
        const { id, loginName, isAdmin, isActive } = login;
        this.form = { id, loginName, isAdmin, isActive };
      } else {
        this.form = {};
      }
      $(`#login-edit-modal`).modal({backdrop: `static`});
    };

    this.save = () => {
      $(`#login-edit-modal`).modal('hide');
      console.log(this.form);
    };
  });

  // .controller('ShopsController', function(shops, entry, $location) {
  // });
})();
