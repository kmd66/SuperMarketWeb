(() => {
    angular
        .module('evaluation')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['ObjectService', 'loadingService', 'globalService'];
    function HomeController(ObjectService, loadingService, globalService) {
        let home = this;

        home.main = new ObjectService();

        //init();

        //function init() {
        //    home.main.loadingAnnouncements = true;
        //    announcementService.listForBulletin().then((announcements) => {
        //        announcements.map((announcement) => { announcement.Content = decodeURI(announcement.Content) });
        //        home.main.announcements = announcements;

        //        if (globalService.get('currentUserPosition').UserType === 2)
        //            return complaintService.listForTaxPayer({ PageSize: 4 });
        //    }).then((complaints) => {
        //        home.main.complaints = complaints || [];
        //    }).finally(() => {
        //        home.main.loadingAnnouncements = false;
        //    });
        //}
    }
})();