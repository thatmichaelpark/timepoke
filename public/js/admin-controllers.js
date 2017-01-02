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
        const { id, name, imageUrl, isActive, membershipTier } = member;
        members.getShops(id)
        .then(memberShops => {
          memberShops.forEach(shop => {
            shops.filter(s => s.id === shop.shopId)[0].checked = true;
          });
          this.form = { id, name, imageUrl, isActive, membershipTier, shops };
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
      const { id, name, imageUrl, isActive, membershipTier, shops } = this.form;
      const shopIds = shops.filter(shop => shop.checked).map(shop => shop.id);

      (id ? members.patch(id, { name, imageUrl, isActive, membershipTier })
          : members.post({ id, name, imageUrl, isActive, membershipTier }))
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
      if (shop) {
        const { id, name, isActive, imageUrl } = shop;
        this.form = { id, name, isActive, imageUrl };
      }
      else {
        this.form = { isActive: true, imageUrl: 'img/darkroom.jpg' };
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
  })
  .controller('ItemsController', function(items, shops, boo) {
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

    this.getItems = () => {
      items.get()
      .then(data => {
        this.items = data;
      })
      .catch(err => {
        boo.boo(err);
      });
    }

    this.getItems();
    this.getShops();

    this.shopLookup = (shopId) => this.shops ?
      this.shops.filter(shop => shop.id === shopId)[0].name
      : null;

    this.click = (item) => {
      if (item) {
        const { id, name, isActive, shopId } = item;
        this.form = { id, name, isActive, shopId };
      }
      else {
        this.form = { isActive: true, shopId: 1 };
      }
      $(`#item-edit-modal`).modal({backdrop: `static`});
    };

    this.save = (data) => {
      $(`#item-edit-modal`).modal('hide');
      (this.form.id ? items.patch(this.form) : items.post(this.form))
      .then((res) => {
        this.getItems();
      })
      .catch((err) => {
        boo.boo(err);
      });
    };
  })
  .controller('ReportsController', function(report, shops, boo) {
    this.showActiveOnly = true;

    this.filter = () => {
      return this.showActiveOnly ?
        { memberName: this.searchString, isActive: true } :
        { memberName: this.searchString };
    };

    this.getReports = () => {
      report.getReports()
      .then(data => {
        this.reports = data;
      })
      .catch(err => {
        boo.boo(err);
      });
    };

    this.getReports();

    this.click = (r) => {
      this.form = { memberName: r.memberName };
      report.getReportDetails(r.memberId)
      .then(deets => {
        this.form.deets = deets;
      })
      .catch(err => boo.boo(err));

      $(`#report-edit-modal`).modal({backdrop: `static`});
    };


  });
})();
