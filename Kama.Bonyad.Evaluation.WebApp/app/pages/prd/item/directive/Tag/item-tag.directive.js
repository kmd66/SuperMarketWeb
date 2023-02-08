(() => {
    angular
        .module('evaluation')
        .directive('kamaItemTag', kamaItemTag);

    kamaItemTag.$inject = ['tagService', 'alertService','loadingService'];
    function kamaItemTag(tagService, alertService, loadingService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./item-tag.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , tag: '=tag'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let item = scope;

            item.tag.save = save;

            item.tag.editModel = {};

            item.tag.grid = {
                bindingObject: item.tag
                , columns: [
                    { name: 'TagName', displayName: 'نام' }
                ]
                , initload: false
                , hideFooter: true
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return { ItemID: item.modify.model.ID }; }
                , listService: tagService.list
                , onAdd: (e) => {
                    item.tag.editModel = {};
                    $(`#tag-modal`).modal('show');
                }
                , onEdit: (e) => {

                    alertService.error('اجازه انجام این کار وجود ندارد');
                    //item.tag.editModel = e;
                    //$(`#tag-modal`).modal('show');
                }
                , deleteService: (e) => {
                    item.tag.editModel = e;
                    return remove();
                }
            };
            function save() {
                tagService.save({ ItemID: item.modify.model.ID, TagName: item.tag.editModel.TagName }).then((result) => {
                    return item.tag.grid.getlist(false);
                }).then(() => {
                    alertService.success('برچسب با موفقیت ثبت شد');
                }).catch(alertService.error).finally(() => {
                    loadingService.hide();
                    $(`#tag-modal`).modal('hide');
                });
            }
            function remove() {
                return tagService.remove({ ItemID: item.modify.model.ID, TagID: item.tag.editModel.TagID }).then(() => {
                    return item.tag.grid.getlist(false);
                });
            }

        }
    }
})();
