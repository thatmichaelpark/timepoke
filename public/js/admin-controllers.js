(function() {
  'use strict';

  angular.module('adminApp')
  .controller(`AdminController`, function() {
    this.logout = () => {
      alert('log out');
    };
  })
  .controller(`MembersController`, function(members, shops) {
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
        alert(err.statusText);
        console.log(err);
      });

    this.click = (member) => {
      shops.get()
      .then(shops => {
        if (!member) {
          this.form = { isActive: true, shops };
          return;
        }
        const { id, name, imageUrl, isActive } = member;
        members.getShops(id)
        .then(memberShops => {
          memberShops.forEach(shop => {
            shops.filter(s => s.id === shop.shopId)[0].checked = true;
          });
          this.form = { id, name, imageUrl, isActive, shops };
        })
      })
      .then(blah => {
        console.log(blah);
        $(`#member-edit-modal`).modal({backdrop: `static`});
      })
      .catch(err => {
        alert(err.statusText);
        console.log(err);
      });
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

    this.getLogins = () => {
      logins.get()
      .then(data => {
        this.logins = data;
      })
      .catch(err => {
        alert(err.statusText);
      });
    }

    this.getLogins();

    this.click = (login) => {
      if (login) {
        const { id, loginName, isAdmin, isActive } = login;
        this.form = { id, loginName, isAdmin, isActive };
      }
      else {
        this.form = { isAdmin: false, isActive: true };
      }
      $(`#login-edit-modal`).modal({backdrop: `static`});
    };

    this.save = (data) => {
      $(`#login-edit-modal`).modal('hide');
      (this.form.id ? logins.patch(this.form) : logins.post(this.form))
      .then((res) => {
        this.getLogins();
      })
      .catch((err) => {
        alert(err.statusText);
        console.log(err);
      });
    };
  });

  // .controller('ShopsController', function(shops, entry, $location) {
  // });
})();
