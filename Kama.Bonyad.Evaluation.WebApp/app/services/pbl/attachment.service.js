(() => {
    angular
        .module('evaluation')
        .factory('attachmentService', attachmentService);

    attachmentService.$inject = ['httpService', '$http', '$q', 'alertService', 'globalService'];
    function attachmentService(httpService, $http, $q, alertService, globalService) {
        let service = {
            get: get
            , list: list
            , remove: remove
            , save: save
            , saveList: saveList
            , upload: upload
        };

        return service;

        function get(model) {
            return httpService.Attachment.Get(model);
        }
        function list(model) {
            return httpService.Attachment.List(model);
        }
        function remove(model) {
            return httpService.Attachment.Remove(model);
        }
        function save(model) {
            return httpService.Attachment.Save(model);
        }
        function saveList(model) {
            return httpService.Attachment.SaveList(model);
        }
        function upload(fileData) {
            return $http.post(
                '/Attachment/Upload'
                , fileData
                , { transformRequest: angular.identity, headers: { 'Content-type': undefined } }
            ).then((result) => {
                if (!result.data.Success) {
                    if (result.data === 'حجم فایل بزرگتر از حد مجاز است')
                        return $q.reject(result.data.Message || 'حجم فایل بزرگتر از حد مجاز است')
                    else
                        return $q.reject(result.data.Message || 'خطای ناشناخته')
                }

                return result.data.Data;
            }).catch((error) => {
                return $q.reject(error);
            });
        }
    }
})();