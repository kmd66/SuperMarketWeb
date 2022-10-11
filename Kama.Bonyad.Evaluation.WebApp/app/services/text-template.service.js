(() => {
    angular
        .module('evaluation')
        .factory('textTemplateService', textTemplateService);

    textTemplateService.$inject = ['httpService', '$q'];
    function textTemplateService(httpService, $q) {
        let service = {
            save: save
            , get: get
            , remove: remove
            , archive: archive
            , unArchive: unArchive
            , listForOwner: listForOwner
            , listForTypist: listForTypist
        };

        return service;

        function save(model) {
            model.errors = [];

            if (!model.Subject)
                model.errors.push('موضوع را وارد کنید.');
            if (!model.OwnerUserID)
                model.errors.push('گیرنده را مشخص کنید.');
            if (!model.Content)
                model.errors.push('متن را وارد کنید.');

            if (model.errors.length)
                return $q.reject();

            if (!model.ID)
                return httpService.TextTemplate.Add(model);
            else
                return httpService.TextTemplate.Edit(model);
        }
        function get(model) {
            return httpService.TextTemplate.Get(model);
        }
        function remove(model) {
            return httpService.TextTemplate.Remove(model);
        }
        function archive(model) {
            return httpService.TextTemplate.Archive(model);
        }
        function unArchive(model) {
            return httpService.TextTemplate.UnArchive(model);
        }
        function listForOwner(model) {
            return httpService.TextTemplate.ListForOwner(model);
        }
        function listForTypist(model) {
            return httpService.TextTemplate.ListForTypist(model);
        }
    }
})();