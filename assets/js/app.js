var app;

app = angular.module("app", []);

app.controller("MaintCtrl", function(LS) {
  this.greeting = "This is a local storage demo";
  this.value = LS.getData();
  this.latestData = function() {
    return LS.getData();
  };
  this.update = function(val) {
    return LS.setData(val);
  };
});

app.factory("LS", function($window, $rootScope) {
  angular.element($window).on('storage', function(event) {
    if (event.key === 'my-storage') {
      $rootScope.$apply();
    }
  });
  return {
    setData: function(val) {
      $window.localStorage && $window.localStorage.setItem('my-storage', val);
      return this;
    },
    getData: function() {
      return $window.localStorage && $window.localStorage.getItem('my-storage');
    }
  };
});
