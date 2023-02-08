(() => {
    angular
        .module('evaluation')
        .config(config);

    config.$inject = ['$routeProvider', '$qProvider', '$httpProvider'];
    function config($routeProvider, $qProvider, $httpProvider) {
        $routeProvider
            .when('/', { template: require('./pages/home/home.html'), controller: 'HomeController', controllerAs: 'home' })
            .when('/contact-o', { template: require('./pages/contact/contact-outside.html'), data: { title: 'تماس با ما' } })
            .when('/faq-o', { template: require('./pages/faq/faq-outside.html'), data: { title: 'سوالات متداول' } })
            .when('/index', { template: require('./pages/index/index.html'), controller: 'IndexController', controllerAs: 'index', data: { title: 'صفحه اصلی' } })
            .when('/init', { template: require('./pages/init/init.html'), controller: 'InitController', controllerAs: 'init' })

            //--------Org-------//
            .when('/command/', { template: require('./pages/organization/command/command.html'), controller: 'CommandController', controllerAs: 'command', data: { title: 'دسترسی‌ها', menu: 'settings' } })
            .when('/login/:state?', { template: require('./pages/organization/login/login.html'), controller: 'LoginController', controllerAs: 'login', data: { title: 'ورود' } })
            .when('/reset-password/:type/:userId', { template: require('./pages/organization/reset-password/reset-password.html'), controller: 'ResetPasswordController', controllerAs: 'resetPassword', data: { title: 'بازنشانی کلمه عبور' } })
            .when('/signup/:type', { template: require('./pages/signup/signup.html'), controller: 'SignupController', controllerAs: 'signup', data: { title: 'ثبت نام' } })
            .when('/verify-cellphone/:userId', { template: require('./pages/organization/verify-cellphone/verify-cellphone.html'), controller: 'VerifyCellphoneController', controllerAs: 'verify', data: { title: 'فعال‌سازی تلفن همراه' } })            
            .when('/user-settings/', { template: require('./pages/organization/user-settings/user-settings.html'), controller: 'UserSettingsController', controllerAs: 'setting', data: { title: 'تنظیمات', menu: 'basic-info' } })
            .when('/application/:state/:id?', { template: require('./pages/organization/application/application.html'), controller: 'ApplicationController', controllerAs: 'application', reloadOnUrl: false })
            //--------Org-------//

            //--------api-------//
            .when('/saleinperson/', { template: require('./pages/prd/stock/saleinperson/saleinperson.html'), controller: 'SaleinpersonController', controllerAs: 'saleinperson', reloadOnUrl: false })

            .when('/product-classific/:state/:id?', { template: require('./pages/prd/product-classification/product-classification.html'), controller: 'ProductClassificationController', controllerAs: 'productClassific', reloadOnUrl: false })
            .when('/classific/:state/:id?', { template: require('./pages/prd/classification/classification.html'), controller: 'ClassificationController', controllerAs: 'classification', reloadOnUrl: false })
            .when('/item/:state/:id?', { template: require('./pages/prd/item/item.html'), controller: 'ItemController', controllerAs: 'item', reloadOnUrl: false })
            .when('/stock/:state/:id?', { template: require('./pages/prd/stock/main/stock.html'), controller: 'StockController', controllerAs: 'stock', reloadOnUrl: false })
            .when('/information/:state', { template: require('./pages/prd/information/information.html'), controller: 'InformationController', controllerAs: 'information', reloadOnUrl: false })

            .when('/brand/:state/:id?', { template: require('./pages/pbl/brand/brand.html'), controller: 'BrandController', controllerAs: 'brand', reloadOnUrl: false })
           //--------api-------//


            .when('/not-found', { template: require('./pages/not-found/not-found.html'), controller: 'NotFoundController', controllerAs: 'notFound', data: { title: 'صفحه مورد نظر یافت نشد' } })

            .otherwise({ template: require('./pages/not-found/not-found.html'), controller: 'NotFoundController', controllerAs: 'notFound', data: { title: 'صفحه مورد نظر یافت نشد' } });


        $qProvider.errorOnUnhandledRejections(false);
        $httpProvider.interceptors.push('authInterceptorService');
        $httpProvider.defaults.withCredentials = true;

        function currentUserPosition() {
            if (localStorage.currentUserPosition)
                return JSON.parse(localStorage.currentUserPosition);
            else
                return {};
        }
    }
})();