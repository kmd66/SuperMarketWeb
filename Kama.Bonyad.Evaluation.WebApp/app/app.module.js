// please follow this style guide: https://github.com/johnpapa/angular-styleguide/tree/master/a1

(() => {
    require("./css/kama-bootstrap-rtl.scss");
    require("./css/template.scss");
    require("./css/style.scss");
    require("./css/nightmode.scss");
    require("./css/pages.scss");
    require("./css/directives.scss");

    angular
        .module('evaluation'
            , ['ngRoute'
                , 'ngAnimate'
                , 'smart-table'
                , 'ngStorage'
                , 'ngSanitize'
                , 'treeGrid'
                , 'kama-module'
                , 'lvl.directives.dragdrop']
        );
})();