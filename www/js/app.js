// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

var app = angular.module('todo', ['ionic']);

app.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
});


app.controller('TodoCtrl', function ($scope, $rootScope, $timeout, $ionicModal,
Projects, $ionicSideMenuDelegate) {

  $scope.createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
    $scope.projectModal.hide();
    projectTitle = '';
  }
  $scope.projects = Projects.all();

  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  $scope.newProject = function(name) {
    var projectTitle = name;
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $scope.delProject = function(project) {
    var index = $scope.projects.indexOf(project);
    $scope.projects.splice(index, 1);
    Projects.save($scope.projects);
    var prev = index - 1;
    if (prev < 0) {
      prev = index;
    }
    var prevProj = $scope.projects[prev];
    $scope.activeProject = prevProj;
    Projects.setLastActiveIndex(prev);
    if ($scope.projects.length == 0) {
      $scope.makeProject();
    }
  };

  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('edit-task.html', function(modal) {
    $scope.taskEditModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });


  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      $scope.taskModal.hide();
      $scope.makeProject();
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();
    Projects.save($scope.projects);
    task.title = "";
  };

  $scope.formData = {};

  $scope.doEdit = function(task) {
    $scope.taskEditModal.show();
    var index = $scope.activeProject.tasks.indexOf(task);
    $rootScope.etask = task;
    $rootScope.eindex = index;
  };
  $scope.removeTask = function(task) {
    var index = $scope.activeProject.tasks.indexOf(task);
    $scope.activeProject.tasks.splice(index, 1);
    Projects.save($scope.projects);
  };

  $scope.setNew = function() {
    $rootScope.etitle = $rootScope.newtitle;
  }

  $scope.editTask = function(task) {
    $scope.taskEditModal.show();
  };

  $scope.finishEdit = function() {
    $scope.activeProject.tasks[$rootScope.eindex].title = $scope.formData.newtitle;
    Projects.save($scope.projects);
    $scope.taskEditModal.hide();
    $scope.formData.newtitle = '';
  };

  $scope.closeEditTask = function() {
    $scope.taskEditModal.hide();
  };

  $scope.newTask = function() {
    if (!$scope.activeProject) {
      $scope.makeProject();
      return;
    }
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $ionicModal.fromTemplateUrl('project.html', function(modal) {
    $scope.projectModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.closeAddProject = function() {
    $scope.projectModal.hide();
  };

  $scope.makeProject = function() {
    $scope.projectModal.show();
  };

  $timeout(function() {
    if($scope.projects.length == 0) {
      $scope.makeProject();
    }
  }, 1000);
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

// .controller("EditCtrl", function($scope, $ionicModal, Projects) {
//
//   $ionicModal.fromTemplateUrl('edit-task.html', function(modal) {
//     $scope.taskEditModal = modal;
//   }, {
//     scope: $scope,
//     animation: 'slide-in-up'
//   });
//
//   $scope.doEdit = function(task) {
//     if(!$scope.activeProject || !task) {
//       return;
//     }
//     var tasks = $scope.activeProject.tasks;
//     var index = $scope.activeProject.tasks.indexOf(task);
//     tasks[index].title = task.title;
//     $scope.taskModal.hide();
//     Projects.save($scope.projects);
//   };
//
//   $scope.editTask = function(task) {
//     $scope.taskEditModal.show();
//   };
//
//   $scope.closeEditTask = function() {
//     $scope.taskEditModal.hide();
//   };
//
//
// })
