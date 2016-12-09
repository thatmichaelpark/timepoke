(function() {
  'use strict';

  angular.module('monoculturedApp')
  // .controller('MembersController', ($scope, $location) => {
    // const ipc = electron.ipcRenderer;
    //
    // ipc.on('edit', (event, args) => {
    //   $location.path(args);
    //   $scope.$apply();
    // });
  // })
  .controller('ShopsController', function(shops, entry, $location) {
    this.entry = entry;
    shops.get()
    .then((data) => {
      this.shops = data;
    })
    .catch((err) => {
      console.log(err);
    });
    this.click = (shop) => {
      this.entry.shopId = shop.id;
      this.entry.shopName = shop.name;
      this.entry.hours = 0;
      shops.getItems(shop.id)
      .then((items) => {
        this.entry.items = items.map(item => {
          return {
            id: item.id,
            name: item.name,
            quantity: 0
          };
        });
        $location.path(`resources`);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    this.clickBack = () => {
      $location.path(`/`);
    };
  })
  .controller(`ResourcesController`, function($location) {
    this.clickBack = () => {
      $location.path(`shops`);
    };
    this.clickConfirm = () => {
      $location.path(`memberslist`);
    }
  })
  .controller('HoursController', function(entry) {
    this.entry = entry;
    this.click = (plusMinus) => {
      if (plusMinus === `+`) {
        ++this.entry.hours;
      } else { // -
        if (this.entry.hours) {
          --this.entry.hours;
        }
      }
    }
  })
  .controller('ItemsController', function(entry, $location) {
    this.entry = entry;
    this.click = (plusMinus, item) => {
      if (plusMinus === '+') {
        ++item.quantity;
      } else { // -
        if (item.quantity) {
          --item.quantity;
        }
      }
    };
  })
  .controller('MembersListController', function(members, entry, $location) {
    members.get()
    .then((data) => {
      this.members = data;
    })
    .catch((err) => {
      console.log(err);
    });
    this.members = [];
    this.click = (member) => {
      entry.memberId = member.id;
      entry.memberName = member.name;
      $location.path(`summary`);
    }
    this.clickBack = () => {
      $location.path(`resources`);
    };
  })
  .controller('SummaryController', function(entry, $location) {
    this.entry = entry;
    this.filterFn = () => {
      return (item) => item.quantity;
    };
    this.clickBack = () => {
      $location.path(`memberslist`);
    };
    this.clickConfirm = () => {
      entry.post(this.entry, () => {
        $location.path(`report`);
      });
    }
  })
  .controller(`ReportController`, function(report, $location) {
    const parseItems = (item) => {
      const result = [];
      const re = /[\\"]*([\w\s]+)[\\"]*,(\d+)/g;
      let x;

      while ((x = re.exec(item)) !== null) {
        result.push({
          name: x[1],
          quantity: Number.parseInt(x[2])
        });
      }
      return result;
    };

    report.get()
    .then((entries) => {
      entries.map(entry => {
        entry.items = parseItems(entry.items);
        return entry;
      });

      this.itemNames = [];
      this.shopNames = [];
      for (const entry of entries) {
        if (this.shopNames.indexOf(entry.shopName) === -1) {
          this.shopNames.push(entry.shopName);
        }
        for (const item of entry.items) {
          if (this.itemNames.indexOf(item.name) === -1) {
            this.itemNames.push(item.name);
          }
        }
      }
      this.shopNames.sort();
      this.itemNames.sort();

      const table = [];
      for (const entry of entries) {
        const row = {
          date: entry.createdAt,
          name: entry.memberName,
          shopHours: Array(this.shopNames.length),
          itemQtys: Array(this.itemNames.length)
        };
        row.shopHours[this.shopNames.indexOf(entry.shopName)] = entry.hours;
        for (const item of entry.items) {
          row.itemQtys[this.itemNames.indexOf(item.name)] = item.quantity;
        }
        table.push(row);
      }
      this.data = table;
    })
    .catch((err) => {
      console.log(err);
    });
    this.clickConfirm = () => {
      $location.path(`/`);
    }
  })
  // .controller('UsersController', function(users) {
  //   const loadUsers = () => {
  //     users.get()
  //     .then((data) => {
  //       this.users = data;
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  //   };
  //
  //   loadUsers();
  //
  //   this.click = function(id) {
  //     users.delete(id)
  //     .then(() => {
  //       loadUsers();
  //     })
  //     .catch((err) => {
  //       Materialize.toast(err.data, 4000);
  //     });
  //   };
  // })
  // .controller('UsersFormController', function(
  //   users, $routeParams, $location
  // ) {
  //   const { id } = $routeParams;
  //
  //   this.form = {};
  //   users.getOne(id)
  //   .then((data) => {
  //     this.form.id = data.id;
  //     this.form.username = data.username;
  //   })
  //   .catch((err) => {
  //     Materialize.toast(err.data, 4000);
  //   });
  //
  //   this.submit = () => {
  //     users.patch(this.form.id, this.form)
  //     .then(() => {
  //       $location.path('users');
  //     })
  //     .catch((err) => {
  //       Materialize.toast(err.data, 4000);
  //     });
  //   };
  // })
  // .controller('PuzzlesController', function(puzzles) {
  //   const loadPuzzles = () => {
  //     puzzles.get()
  //     .then((data) => {
  //       this.puzzles = data;
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  //   };
  //
  //   loadPuzzles();
  //
  //   this.click = function(id) {
  //     puzzles.delete(id)
  //     .then(() => {
  //       loadPuzzles();
  //     })
  //     .catch((err) => {
  //       Materialize.toast(err.data, 4000);
  //     });
  //   };
  // })
  //
  //  // eslint-disable-next-line max-params
  // .controller('PuzzlesFormController', function(
  //   puzzles, $routeParams, $timeout, $location, $scope
  // ) {
  //   const puzzleId = $routeParams.id;
  //
  //   this.form = {};
  //
  //   $scope.$watch(() => this.form.imageUrls, () => {
  //     $scope.$$postDigest(() => {
  //       $('select').material_select();
  //     });
  //   });
  //
  //   readImageDirectory((err, files) => {
  //     if (err) {
  //       return Materialize.toast(err, 4000);
  //     }
  //     this.form.imageUrls = files.map((file) => `/images/${file}`);
  //   });
  //
  //   if (puzzleId === 'new') {
  //     (() => {  // initialize new puzzle
  //       this.form.imageUrl = '';
  //       this.form.nRows = 2;
  //       this.form.nCols = 2;
  //       this.form.pieceContentSize = 100;
  //       this.form.hasRotatedPieces = false;
  //       this.form.nWaves = 0;
  //       this.form.maxWaveDepth = 0;
  //       this.form.maxFreq = 0;
  //       this.form.maxV = 0;
  //       this.form.backgroundColor = '#ffffff';
  //     })();
  //   }
  //   else {
  //     puzzles.getOne(puzzleId)
  //     .then((data) => {
  //       this.form.id = data.id;
  //       this.form.imageUrl = data.imageUrl;
  //       this.form.nRows = data.nRows;
  //       this.form.nCols = data.nCols;
  //       this.form.pieceContentSize = data.pieceContentSize;
  //       this.form.hasRotatedPieces = data.hasRotatedPieces;
  //       this.form.nWaves = data.nWaves;
  //       this.form.maxWaveDepth = data.maxWaveDepth;
  //       this.form.maxFreq = data.maxFreq;
  //       this.form.maxV = data.maxV;
  //       this.form.backgroundColor = data.backgroundColor;
  //     })
  //     .catch((err) => {
  //       Materialize.toast(err.data, 4000);
  //     });
  //   }
  //
  //   this.submit = () => {
  //     delete this.form.imageUrls;
  //     const { id } = this.form;
  //
  //     if (id) {
  //       puzzles.patch(id, this.form)
  //       .then(() => {
  //         $location.path('puzzles');
  //       })
  //       .catch((err) => {
  //         Materialize.toast(err.data, 4000);
  //       });
  //     }
  //     else {
  //       puzzles.post(this.form)
  //       .then(() => {
  //         $location.path('puzzles');
  //       })
  //       .catch((err) => {
  //         Materialize.toast(err.data, 4000);
  //       });
  //     }
  //   };
  // })
  ;
})();
