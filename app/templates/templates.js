/*
The MIT License

Copyright (c) 2016-2020 Nabarun Sarkar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
angular.module('templateStore.templates',['ngRoute','ngCookies'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/gallery', {
			templateUrl: 'templates/templates.html',
			controller: 'templatesCtrl'
		}).
		when('/gallery/:templateId', {
			templateUrl: 'templates/template-details.html',
			controller: 'templateDetailsCtrl'
		}).
		when('/add-item', {
			templateUrl: 'templates/template-update.html',
			controller: 'templateUpdateCtrl'
		}).
		when('/login', {
			templateUrl: 'templates/login.html',
			controller: 'loginCtrl'
		}).
		when('/about', {
			templateUrl: 'templates/about.html',
			controller: 'aboutCtrl'
		}).
		when('/contact', {
			templateUrl: 'templates/contact.html',
			controller: 'contactCtrl'
		});
}])

.directive('footer', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "templates/footer.html",
        controller: ['$scope', '$filter', '$location', function ($scope, $filter, $location) {
        	// console.log($location.path());
            if($location.path()=="/add-item")
            	$scope.showFooter = false;
            else
            	$scope.showFooter = true;
        }]
    }
})

.directive('header', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "templates/head.html",
        controller: ['$scope', '$filter', '$location', function ($scope, $filter, $location) {
        	// console.log($location.path());
            if($location.path()=="/add-item")
            	$scope.showHeader = false;
            else
            	$scope.showHeader = true;
        }]
    }
})

.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 }])

.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
       var fd = new FormData();
       fd.append('file', file);
    
       $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
       })
    
       .success(function(){
       		console.log("Uploaded.");
       })
    
       .error(function(){
       		console.log("Not uploaded.");
       });
    }
 }])

.controller('templatesCtrl', ['$scope', '$http', function($scope, $http){
	$scope.dataLoading = true;
	$http.get('json/data-api.php').success(function(data){
		// console.log(data);
		$scope.templates = data;
		$scope.dataLoading = false;

	});
}])

.controller('templateDetailsCtrl', ['$scope', '$routeParams', '$http', '$filter', function($scope, $routeParams, $http, $filter){
	// console.log($scope);
	$scope.dataLoading = true;
	var templateId = $routeParams.templateId;
	$http.get('json/data-api.php').success(function(data){
		// console.log(data);
		$scope.templateDetails = $filter('filter')(data, function(d){
			return d.permalink == templateId;
		})[0];
		$scope.mainImage = $scope.templateDetails.images[0];
		$scope.dataLoading = false;
	});

	$scope.setImage = function(image){
		$scope.mainImage = image;
	};
}])

.controller('loginCtrl', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){
	// console.log($scope);
	$scope.login = function(){
		$scope.dataLoading = true;

		if($scope.username){var username = $scope.username;} else{var username = null;}
		if($scope.password){var password = $scope.password;} else{var password = null;}

		var fd = $.param({
   					action: "login",
			        username: username,
			        password: sha1(password)
			    });

		$http.post("json/utility.php", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
       })

		.success(function(data){
       		if(data.result=="Success"){
       			console.log("User login success.");

       			$cookies.put('sessId', data.id);

       			$location.path( "/add-item" );

			}else
				console.log("User login failed: "+data.result);
		    // $scope.msg = "Item addition status: ";
			$scope.dataLoading = false;
       })
    
       .error(function(){
       		console.log("User login error.");
       });
	};
}])

.controller('templateUpdateCtrl', ['$scope', '$http', 'fileUpload', '$cookies', '$location', function($scope, $http, fileUpload, $cookies, $location){

	$scope.dataLoading = true;

	var uploadUrl = "json/upload.php";

	var sessId = $cookies.get('sessId');

	function loadItems(){
		$http.get('json/data-api.php').success(function(data){
			$scope.templates = data;
			$scope.dataLoading = false;
		});
	}

	function checkLogin(){

		var fd = $.param({
   					action: "chkLogin",
			        sessId: sessId
			    });

		$http.post("json/utility.php", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
       })

		.success(function(data){
       		if(data.result=="Success"){
       			console.log("User logged in.");

       			loadItems();

			}else{
				console.log("User login failed: "+data.result);
				$cookies.remove('sessId');
       			$location.path( "/login" );
       		}
       })
    
       .error(function(){
       		console.log("User login error.");
       		$cookies.remove('sessId');
   			$location.path( "/login" );
       });
	}

	checkLogin();


	$scope.logout = function(){
		$cookies.remove('sessId');
		$location.path( "/login" );
	}
		
	$scope.addFormShow = function(){
		$scope.showAddForm = true;
		$scope.itemShowBool = false;
		$scope.itemEditBool = false;
	};

	$scope.addFormHide = function(){
		$scope.showAddForm = false;
	};

	$scope.updatePermalink = function(){
		if($scope.name){
			var	str = $scope.name;
			var res = str.toLowerCase().replace(/\s+/ig, "-").replace(/[^a-z-]+/ig, "");

			$scope.permalink = res;
		}else{
			$scope.permalink = "";
		}
	};

	$scope.activatePermBtn = function(){
		$scope.showPermBtn = true;
	};

	$scope.addFormSubmit = function(){
		console.log("Submitting...");

		if($scope.name){var name = $scope.name;} else{var name = null;}
		if($scope.description){var description = $scope.description;} else{var description = null;}
		if($scope.tempType){var tempType = $scope.tempType;} else{var tempType = null;}
		if($scope.price){var price = $scope.price;} else{var price = null;}
		if($scope.myFile){var file = $scope.myFile;} else{var file = null;}
		if($scope.permalink){var permalink = $scope.permalink;} else{var permalink = null;}

		// console.log('file is '+file.name);
//         console.dir(file);

   		var fd = $.param({
   					action: "add",
			        name: name,
			        description: description,
			        type: tempType,
			        price: price,
			        permalink: permalink,
			        sessId: sessId,
			        image: file.name
			    });

			$http.post("json/utility.php", fd, {
	          transformRequest: angular.identity,
	          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	       })

   			.success(function(data){
	       		if(data.result=="Success"){
	       			console.log("Item added.");

        			fileUpload.uploadFileToUrl(file, uploadUrl);

        			loadItems();

				    $scope.showAddForm = false;
				    clearFields();
				}
			    $scope.msg = "Item addition status: "+data.result;
	       })
	    
	       .error(function(){
	       		console.log("Item not added.");
	       });
	}

	$scope.viewItem = function(item){
		$scope.viewName = item.name;
		$scope.viewDescription = item.description;
		$scope.viewType = item.type;
		$scope.viewPrice = item.price;
		$scope.permalink = item.permalink;
		$scope.images = item.images;

		$scope.itemShowBool = true;
		$scope.showAddForm = false;
		$scope.itemEditBool = false;
	};

	$scope.viewItemHide = function(){
		$scope.itemShowBool = false;
		clearFields();
	};

	$scope.editItem = function(item){
		$scope.id = item.id;
		$scope.name = item.name;
		$scope.description = item.description;
		$scope.tempType = item.type;
		$scope.price = item.price;
		$scope.permalink = item.permalink;
		$scope.images = item.images;

		$scope.itemEditBool = true;
		$scope.showAddForm = false;
		$scope.itemShowBool = false;
	};

	$scope.editItemHide = function(){
		$scope.itemEditBool = false;
		$scope.showPermBtn = false;

		clearFields();
	};

	$scope.editFormSubmit = function(){
		console.log("Submitting edit...");

		var id = $scope.id;

		console.log(id);

		if($scope.name){var name = $scope.name;} else{var name = null;}
		if($scope.description){var description = $scope.description;} else{var description = null;}
		if($scope.tempType){var tempType = $scope.tempType;} else{var tempType = null;}
		if($scope.price){var price = $scope.price;} else{var price = null;}
		if($scope.permalink){var permalink = $scope.permalink;} else{var permalink = null;}
		if($scope.myFile){var isFile=true; var file = $scope.myFile;} else{var isFile=false; var file = {"name": $scope.images[0]};}

		console.log('file is '+file.name);
//         console.dir(file);

   		var fd = $.param({
   					action: "update",
   					id: id,
			        name: name,
			        description: description,
			        type: tempType,
			        price: price,
			        sessId: sessId,
			        permalink: permalink,
			        image: file.name
			    });

			$http.post("json/utility.php", fd, {
	          transformRequest: angular.identity,
	          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	       })

   			.success(function(data){
   				// console.log(data);
	       		if(data.result=="Success"){
	       			console.log("Item updated.");

	       			if(isFile){
        				fileUpload.uploadFileToUrl(file, uploadUrl);
        			}

        			loadItems();

				    $scope.itemEditBool = false;
				    clearFields();
				}
			    $scope.msg = "Item update status: "+data.result;
	       })
	    
	       .error(function(){
	       		console.log("Item not updated.");
	       });
	};

	$scope.removeItem = function(item, index, items){
		var id = item.id;

		console.log("Removing...");

		var fd = $.param({
				action: "remove",
		        id: id
		    });

		$http.post("json/utility.php", fd, {
	      transformRequest: angular.identity,
	      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	   })

		.success(function(data){
	   		if(data.result=="Success"){
	   			console.log("Item removed.");

	   			items.splice(index, 1);

	   			$scope.itemEditBool = false;
				$scope.showAddForm = false;
				$scope.itemShowBool = false;
			}
		    $scope.msg = "Item removal status: "+data.result;
	   })

	   .error(function(){
	   		console.log("Item not removed.");
	   });
	}

	function clearFields(){
		console.log("Clearing fields...");

		$scope.name = "";
		$scope.description = "";
		$scope.price = "";
		$scope.tempType = "";
		$scope.permalink = "";
		$scope.myFile = "";

	}
}]);
