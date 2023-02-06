//(() => {
//    angular
//        .module('evaluation')
//        .directive('kamaProductTag', kamaProductTag);

//    kamaProductTag.$inject = ['tagService', 'alertService','loadingService'];
//    function kamaProductTag(tagService, alertService, loadingService) {
//        let directive = {
//            link: {
//                pre: preLink
//            }
//            , template: require('./product-tag.directive.html')
//            , restrict: 'E'
//            , scope: {
//                main: '=main'
//                , modify: '=modify'
//                , tag: '=tag'
//            }
//        };

//        return directive;

//        function preLink(scope, element, attrs) {
//            let product = scope;

//            product.tag.save = save;

//            product.tag.editModel = {};

//            product.tag.gridTag = {
//                bindingObject: product.tag
//                , columns: [
//                    { name: 'TagName', displayName: 'نام' }
//                ]
//                , initload: false
//                , hideFooter: true
//                , pageSize: 100//globalService.get('userSettings').PageSize
//                , options: () => { return { ProductID: product.modify.model.ID }; }
//                , listService: tagService.list
//                , onAdd: (e) => {
//                    product.tag.editModel = {};
//                    $(`#tag-modal`).modal('show');
//                }
//                , onEdit: (e) => {

//                    alertService.error('اجازه انجام این کار وجود ندارد');
//                    //product.tag.editModel = e;
//                    //$(`#tag-modal`).modal('show');
//                }
//                , deleteService: (e) => {
//                    product.tag.editModel = e;
//                    return remove();
//                }
//            };
//            function save() {
//                tagService.save({ ProductID: product.modify.model.ID, TagName: product.tag.editModel.TagName }).then((result) => {
//                    return product.tag.gridTag.getlist(false);
//                }).then(() => {
//                    alertService.success('برچسب با موفقیت ثبت شد');
//                }).catch(alertService.error).finally(() => {
//                    loadingService.hide();
//                    $(`#tag-modal`).modal('hide');
//                });
//            }
//            function remove() {
//                return tagService.remove({ ProductID: product.modify.model.ID, TagID: product.tag.editModel.TagID }).then(() => {
//                    return product.tag.gridTag.getlist(false);
//                });
//            }

//        }
//    }
//})();
