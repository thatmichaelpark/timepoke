(function() {
  'use strict';

  angular.module('adminApp')
  .controller(`AdminController`, function() {
    this.logout = () => {
      alert('log out');
    };
  })
  .controller(`MembersController`, function(members, shops, boo) {
    this.showActiveOnly = true;

    this.filter = () => {
      return this.showActiveOnly ?
        { name: this.searchString, isActive: true } :
        { name: this.searchString };
    };

    this.getMembers = () => {
      members.get()
      .then(data => {
        this.members = data;
      })
      .catch(err => {
        boo.boo(err);
      });
    };

    this.getMembers();

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
      .then(() => {
        $(`#member-edit-modal`).modal({backdrop: `static`});
      })
      .catch(err => {
        boo.boo(err);
      });
    };

    this.save = () => {
      const { id, name, imageUrl, isActive, shops } = this.form;
      const shopIds = shops.filter(shop => shop.checked).map(shop => shop.id);

      (id ? members.patch(id, { name, imageUrl, isActive })
          : members.post({ id, name, imageUrl, isActive }))
      .then(() => {
        members.saveShops(id, shopIds);
      })
      .then(() => {
        $(`#member-edit-modal`).modal('hide');
        this.getMembers();
      })
      .catch(err => {
        boo.boo(err);
      });
    };
  })
  .controller(`LoginsController`, function(logins, boo) {
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
        boo.boo(err);
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
        boo.boo(err);
      });
    };
  })
  .controller('ShopsController', function(shops, boo) {
    this.showActiveOnly = true;

    this.filter = () => {
      return this.showActiveOnly ?
        { name: this.searchString, isActive: true } :
        { name: this.searchString };
    };

    this.getShops = () => {
      shops.get()
      .then(data => {
        this.shops = data;
      })
      .catch(err => {
        boo.boo(err);
      });
    }

    this.getShops();

    this.click = (shop) => {
console.log(shop);
      if (shop) {
        const { id, name, isActive } = shop;
        this.form = { id, name, isActive };
      }
      else {
        this.form = { isActive: true };
      }
      $(`#shop-edit-modal`).modal({backdrop: `static`});
    };

    this.save = (data) => {
      $(`#shop-edit-modal`).modal('hide');
      (this.form.id ? shops.patch(this.form) : shops.post(this.form))
      .then((res) => {
        this.getShops();
      })
      .catch((err) => {
        boo.boo(err);
      });
    };
  });
})();
