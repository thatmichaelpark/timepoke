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
        { name: this.searchString, active: true } :
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
        const { id, name, imageUrl, active } = member;
        this.form = { id, name, imageUrl, active };
      } else {
        this.form = {};
      }
      $(`#member-edit-modal`).modal({backdrop: `static`});
    };

    this.save = () => {
      $(`#member-edit-modal`).modal('hide');
      console.log(this.form);
    };
  });

  // .controller('ShopsController', function(shops, entry, $location) {
  // });
})();
