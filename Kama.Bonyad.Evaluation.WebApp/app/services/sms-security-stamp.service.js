(() => {
    angular
        .module('evaluation')
        .factory('smsSecurityStampService', smsSecurityStampService);

    smsSecurityStampService.$inject = ['httpService'];
    function smsSecurityStampService(httpService) {
        let service = {
            send: send
            , verify: verify
        };

        return service;

        function send(model) {
            return httpService.SmsSecurityStamp.Send(model);
        }
        function verify(model) {
            return httpService.SmsSecurityStamp.Verify(model);
        }
    }
})();