(() => {
    const release = require('./version.json');

    angular
        .module('evaluation')
        .run(run);

    run.$inject = ['customHttpService', 'customEnumService', '$rootScope', '$location', '$timeout', '$window', '$route', 'loadingService', 'authenticationService', 'globalService', 'userService', 'toolsService', 'enumService', 'alertService', 'positionService', 'documentService'];
    function run(customHttpService, customEnumService, $rootScope, $location, $timeout, $window, $route, loadingService, authenticationService, globalService, userService, toolsService, enumService, alertService, positionService, documentService) {
        $rootScope.appInfo = { type: 'internet', version: release.version, releaseDate: toolsService.dateToJalali(new Date(parseInt(release.buildDate))), releaseTime: release.buildTime }; // type values: internet, intranet
        $rootScope.currentUserPosition = globalService.get('currentUserPosition');
        $rootScope.currentUserPositions = globalService.get('currentUserPositions');
        $rootScope.enums = enumService;
        $rootScope.logout = userService.logout;
        $rootScope.changePosition = changePosition;
        $rootScope.changeRoute = changeRoute;
        $rootScope.menus = [
            {
                name: 'requests', title: 'درخواست‌ها', icon: 'sticky-note', expand: true, stats: 1
                , subMenus: [
                    { route: 'saleinperson', title: 'فروش حضوزی' }
                ]
            }
            , {
                name: 'store', title: 'انبارها', icon: 'institution'
                , subMenus: [
                    { route: 'depo/cartable', title: 'انبار مخزن' }
                    //, { route: 'stock/cartable', title: 'موجودی' }
                    //, { route: 'product/cartable', title: 'اجناس' }
                    //, { route: 'product-classific/cartable', title: 'دسته بندی کالا' }
                ]
            }
            , {
                name: 'basic-info', title: 'اطلاعات پایه', icon: 'list-ul'
                , subMenus: [
                    { route: 'product-classific/cartable', title: 'دسته بندی کالا' }
                ]
            }
            , {
                name: 'basic-settings', title: 'تعاریف اولیه و تنظیمات', icon: 'list-ul'
                , subMenus: [
                    { route: 'item/cartable', title: 'آیتم محصول' }
                    , { route: 'classific/cartable', title: 'دسته بندی کالا' }
                    , { route: 'brand/cartable', title: 'برند' }
                    , { route: 'information/cartable', title: 'مشخصات محصول' }
                ]
            }
            , {
                name: 'settings', title: 'مدیریت سامانه', icon: 'desktop'
                , subMenus: [
                    { route: 'announcement', title: '-' }
                ]
            }
            , {
                name: 'other', title: 'سایر', icon: 'th'
                , subMenus: [
                    { route: 'announcement', title: '-' }
                ]
            }
        ];

        $rootScope.$on('$locationChangeStart', locationChangeStart);
        $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);
        window.addEventListener('storage', onLocalStorageChange);

        if (globalService.get('authorizationData'))
            documentService.listTypeOfDocument();

        function changePosition(position) {
            if (position.ID !== globalService.get('currentUserPosition').ID) {
                loadingService.show();
                return positionService.setDefault({ positionId: position.ID }).then(() => {
                    globalService.set('currentUserPosition', position);
                    return userService.getRefreshToken({
                        RefreshToken: JSON.parse(localStorage.authorizationData).refresh_token
                    });
                }).then((result) => {
                    authenticationService.setCredentials(JSON.parse(result));
                    $window.location.reload();
                }).catch(loadingService.hide);
            }
        }
        function locationChangeStart(event, next, current) {
            if (authenticationService.isAuthenticated() && !$rootScope.permissions) {
                if (next.split('/')[next.split('/').length - 1] !== 'init')
                    $rootScope.pathBuffer = next.split('#!/')[1];
                return $location.path('init');
            }

            // redirect to login if not authorized
            const restrictedPage = $.inArray($location.path().split('/')[1], [
                'index'
                , 'login'
                , 'signup'
                , 'verify-cellphone'
                , 'faq-o'
                , 'contact-o'
                , 'reset-password'
                , undefined
            ]) === -1;

            if (restrictedPage && !authenticationService.isAuthenticated()) {
                if ($location.path() === '/')
                    $location.path('index');
                else {
                    $location.path('index');
                    userService.logout();
                }
            }
            else if (!restrictedPage && authenticationService.isAuthenticated())
                return event.preventDefault();
        }
        function onLocalStorageChange() {
            if ($rootScope.currentUserPosition.ID !== globalService.get('currentUserPosition').ID) {
                $rootScope.currentUserPosition = globalService.get('currentUserPosition');
                $rootScope.currentUserPositions = globalService.get('currentUserPositions');
                return positionService.getPermissions({ positionId: $rootScope.currentUserPosition.ID }).then((permissions) => {
                    $rootScope.permissions = permissions;
                    return documentService.listTypeOfDocument();
                }).then(() => {
                    $route.reload();
                });
            }
        }
        function changeRoute(route) {
            $rootScope.pathBuffer = route;
            $location.path('init');
        }
        function locationChangeSuccess() {
            $('#content > div').animate({ scrollTop: 0 }, "slow");
        }
    }
})();