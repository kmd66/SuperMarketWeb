(() => {
    angular
        .module('evaluation')
        .factory('applicationService', applicationService);

    applicationService.$inject = ['httpService' , '$q'];
    function applicationService(httpService, $q) {
        let service = {
            list: list,
            get: get,
            save: save,
            remove: remove
        };

        return service;

        function save(model) {
            model.errors = [];

            if (!model.Code) {

                model.errors.push("کد برنامه را وارد کنید");

            }
            if (!model.Name) {

                model.errors.push("نام برنامه را وارد کنید");

            }
            if (!model.Comment) {

                model.errors.push("توضیحات برنامه را وارد کنید");

            }

            if (model.errors.length)
                return $q.reject();

            if (!model.ID)
                return httpService.Application.Add(model);
            else
                return httpService.Application.Edit(model);

        }

        function list(model) {
            return httpService.Application.List(model);
        }

        function remove(id) {
            return httpService.Application.Delete(id);
        }

        function get(model) {

            return httpService.Application.Get(model);

        }
    }
})();