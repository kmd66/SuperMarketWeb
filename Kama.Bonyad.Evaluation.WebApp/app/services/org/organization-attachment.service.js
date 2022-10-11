(() => {
    angular
        .module('evaluation')
        .factory('organizationAttachmentService', organizationAttachmentService);

    organizationAttachmentService.$inject = ['httpService', '$http', '$q', 'alertService', 'globalService'];
    function organizationAttachmentService(httpService, $http, $q, alertService, globalService) {
        let service = {
            download: download
            , get: get
            , list: list
            , remove: remove
            , save: save
            , upload: upload
        };

        return service;

        function download(model) {
            let downloadWindow = window.open();
            return get(model).then((result) => {
                downloadWindow.location = `${window.location.origin}/TemporaryFiles/${result.FileName}`;
            }).catch(() => {
                downloadWindow.close();
                alertService.error('خطا در دانلود فایل');
            });
        }
        function get(model) {
            return httpService.OrganizationAttachment.Get(model);
        }
        function list(model) {
            return httpService.OrganizationAttachment.List(model);
        }
        function remove(model) {
            return httpService.OrganizationAttachment.Remove(model);
        }
        function save(model) {
            return httpService.OrganizationAttachment.Save(model);
        }
        function upload(fileData) {
            fileData.append('userType', globalService.get('currentUserPosition').UserType);
            return $http.post(
                '/OrganizationAttachment/Upload'
                , fileData
                , { transformRequest: angular.identity, headers: { 'Content-type': undefined } }
            ).then((result) => {
                if (!result.data.Success) {
                    if (result.data === 'حجم فایل بزرگتر از حد مجاز است')
                        return $q.reject(result.data.Message || 'حجم فایل بزرگتر از حد مجاز است')
                    else
                        return $q.reject(result.data.Message || 'خطای ناشناخته')
                }

                return result.data.Data.FileName;
                }).catch((error) => {
                    return $q.reject(error);
                //return $q.reject('خطا در بارگذاری فایل');
            });
        }
    }
})();