(() => {
    angular
        .module('evaluation')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['ObjectService', 'authenticationService', 'loadingService'];
    function IndexController(ObjectService, authenticationService, loadingService) {
        let index = this;

        index.main = new ObjectService();

        //init();

        //function init() {
        //    index.main.loadingAnnouncements = true;
        //    authenticationService.clearCredentials();
        //    announcementService.listForBulletin().then((announcements) => {
        //        announcements.map((announcement) => { announcement.Content = decodeURI(announcement.Content) });
        //        index.main.announcements = announcements;
        //    }).finally(() => {
        //        index.main.loadingAnnouncements = false;
        //    });
        //}
    }
})();