import { debug } from "util";

(() => {
    angular
        .module('evaluation')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['ObjectService', 'globalService', '$location', '$q', 'realUserService', 'legalUserService', 'loadingService', 'alertService', '$routeParams', '$window'];
    function ProfileController(ObjectService, globalService, $location, $q, realUserService, legalUserService, loadingService, alertService, $routeParams, $window) {
        let profile = this;
        
        profile.main = new ObjectService();

        profile.main.save = save;
        profile.main.back = back;
        
        init();

        function init() {
            loadingService.show();
            let positionType, userId;
            if ($routeParams.positionType && $routeParams.userId) {
                positionType = $routeParams.positionType;
                userId = $routeParams.userId;
            }
            else {
                positionType = globalService.get('currentUserPosition').Type;
                userId = globalService.get('currentUserPosition').UserID;
            }
            profile.main.positionType = positionType;
            $q.resolve().then(() => {
                if (positionType == 20)
                    return realUserService.get({ ID: userId });
                else if (positionType == 21)
                    return legalUserService.get({ ID: userId });
            }).then((result) => {
                profile.main.model = result;
                profile.main.update();
                loadingService.hide();
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
            });
        }
        function save() {
            loadingService.show();
            var userPositionType = globalService.get('currentUserPosition').Type;
            $q.resolve().then(() => {
                if (userPositionType === 20)
                    return realUserService.save(profile.main.model);
                else if (userPositionType === 21)
                    return legalUserService.save(profile.main.model);
            }).then(() => {
                loadingService.hide();
                alertService.success('تغییرات با موفقیت ذخیره شد');
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
                $('#content > div').animate({ scrollTop: 0 }, 'slow');
            });
        }
        function back() {
            $window.history.back();
        }
    }
})();