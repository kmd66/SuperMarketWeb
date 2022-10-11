(() => {
    angular
        .module('evaluation')
        .directive('kamaContact', kamaContact);

    kamaContact.$inject = ['ObjectService', 'alertService', 'loadingService', 'contactService'];
    function kamaContact(ObjectService, alertService, loadingService, contactService) {
        var directive = {
            link: link
            , template: require('./contact.html')
            , restrict: 'E'
        };

        return directive;

        function link(scope, element, attrs) {
            scope.contact = new ObjectService();
            scope.sendMessage = sendMessage;

            function sendMessage() {
                loadingService.show();
                contactService.add(scope.contact.model).then(() => {
                    scope.contact.model = {};
                    loadingService.hide();
                    alertService.success('پیام با موفقیت ارسال شد');
                }).catch((error) => {
                    loadingService.hide();
                    alertService.error(error);
                    $('#content > div').animate({
                        scrollTop: $('#contact-form-panel').offset().top - $('#contact-form-panel').offsetParent().offset().top
                    }, 'slow');
                });
            }
        }
    }
})();