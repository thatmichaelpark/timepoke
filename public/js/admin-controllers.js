(function() {
  'use strict';

  angular.module('adminApp')
  .controller(`AdminController`, function() {
    this.logout = () => {
      alert('log out');
    };
  })
  .controller(`MembersController`, function(members) {
    this.editing = false;
    this.showActiveOnly = true;
    this.filter = () => {
      return this.showActiveOnly ?
        { name: this.searchString, active: true } :
        { name: this.searchString };
    };
    members.get().then(data => {
      console.log('members controller');
      this.members = data;
    })
    .catch(err => {
      console.log(err);
    });
    this.click = (member) => {
      const { id, name, imageUrl, active } = member;
      this.form = { id, name, imageUrl, active };
      this.editing = !this.editing;
    };
  });

  // .controller('ShopsController', function(shops, entry, $location) {
  // });
})();
