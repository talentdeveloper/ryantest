angular.module('admin.statusconfigures.index', ['ngRoute', 'security.authorization', 'services.utility', 'services.adminResource']);
angular.module('admin.statusconfigures.index').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/admin/statusconfigures', {
      templateUrl: 'admin/statusconfigures/admin-statusconfigures.tpl.html',
      controller: 'statusConfiguresIndexCtrl',
      title: 'Manage StatusConfigures',
      resolve: {
        statusConfigures: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findStatusConfigures();
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/login';              
              return $q.reject();
            })
            .catch(function(){              
              redirectUrl = redirectUrl || '/account';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      },
      reloadOnSearch: false
    });
}]);
angular.module('admin.statusconfigures.index').controller('statusConfiguresIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'statusConfigures',
  function($scope, $route, $location, $log, utility, adminResource, data){
    // local var
    
 
    $scope.addStatusConfig = function(){
      adminResource.addStatusConfig($scope.newStatusName).then(function(data){
        $scope.newStatusName = '';
        if(data.success){
          console.log('complete add clked');
          $route.reload();
        }else if (data.errors && data.errors.length > 0){
          alert(data.errors[0]);
        }else {
          alert('unknown error.');
        }
      }, function(e){
        $scope.statusConfigures = '';
        $log.error(e);
      });
    };

    $scope.statusConfigures = data;
    // $scope vars
    //select elements and their associating optio


  }
]);