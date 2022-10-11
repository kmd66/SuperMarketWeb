using System.Linq;
using System.Reflection;
using Kama.Bonyad.Evaluation.WebApp.Controllers;
using System.Text;
using System.Web.Mvc;
using System;
using System.Collections.Generic;
using System.IO;

namespace Kama.Bonyad.Evaluation.WebApp.Tools
{
    public class ModuleGenerator
    {
        public static string HttpService()
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("(() => {");
            sb.AppendLine("    angular");
            sb.AppendLine("        .module('evaluation')");
            sb.AppendLine("        .factory('customHttpService', customHttpService);");
            sb.AppendLine("");
            sb.AppendLine("    customHttpService.$inject = ['httpService', '$http', '$q', 'authenticationService'];");
            sb.AppendLine("    function customHttpService(httpService, $http, $q, authenticationService) {");
            sb.AppendLine("        let refreshTokenInprogress = 0;");
            sb.AppendLine("");

            var baseControllerType = typeof(BaseController);
            var controllers = Assembly.GetExecutingAssembly()
                    .GetTypes()
                    .Where(a => a.IsClass &&
                                !a.Equals(baseControllerType) &&
                                baseControllerType.IsAssignableFrom(a)).ToList();

            controllers.ForEach(controller =>
            {
                var controllerName = controller.Name.Substring(0, controller.Name.LastIndexOf("Controller"));
                var actions = controller
                             .GetMethods()
                             .Where(action => action.IsPublic &&
                                              action.CustomAttributes
                                             .Any(attr => attr.AttributeType.Equals(typeof(HttpPostAttribute)) ||
                                                          attr.AttributeType.Equals(typeof(HttpGetAttribute)))).ToList();

                var routePrefixAttribute = controller.GetCustomAttribute<RoutePrefixAttribute>();

                sb.AppendLine($"        httpService.{controllerName} = {{");

                actions.ForEach(action =>
                {
                    var routeAttribute = action.GetCustomAttribute<RouteAttribute>();
                    var route = string.Empty;

                    if (routeAttribute == null || routePrefixAttribute == null)
                        route = $"/{controllerName}/{action.Name}";
                    else
                        route = $"/{routePrefixAttribute.Prefix}/{routeAttribute.Template}";

                    sb.AppendLine($"            {action.Name}: new RequestService('{controllerName}/{action.Name}'),");
                });

                sb.AppendLine($"        }};");
            });

            sb.AppendLine("");
            sb.AppendLine("        return httpService;");
            sb.AppendLine("");
            sb.AppendLine("        function RequestService(route, type = 'POST') {");
            sb.AppendLine("            let model = {};");
            sb.AppendLine("");
            sb.AppendLine("            return (params) => {");
            sb.AppendLine("                model = params || {};");
            sb.AppendLine("                return request().then((result) => {");
            sb.AppendLine("                    return onSuccess({ result: result, request: request });");
            sb.AppendLine("                }).catch((result) => {");
            sb.AppendLine("                    return onError({ result: result, request: request });");
            sb.AppendLine("                });");
            sb.AppendLine("            };");
            sb.AppendLine("");
            sb.AppendLine("            function request() {");
            sb.AppendLine("                let options = { method: type, url: route };");
            sb.AppendLine("");
            sb.AppendLine("                if (type === 'GET') {");
            sb.AppendLine("                    for (let key in model) {");
            sb.AppendLine("                        options.url += `/${model[key]}`;");
            sb.AppendLine("                    }");
            sb.AppendLine("                }");
            sb.AppendLine("                else if (type === 'POST') {");
            sb.AppendLine("                    options.data = model;");
            sb.AppendLine("                };");
            sb.AppendLine("");
            sb.AppendLine("                return $http(options);");
            sb.AppendLine("            };");
            sb.AppendLine("        };");
            sb.AppendLine("        function onSuccess(response) {");
            sb.AppendLine("            if (!response.result.data.Success)");
            sb.AppendLine("                return $q.reject(response.result);");
            sb.AppendLine("");
            sb.AppendLine("            return response.result.data.Data;");
            sb.AppendLine("        }");
            sb.AppendLine("        function onError(error) {");
            sb.AppendLine("            if (error.result && error.result.data.Code === 401)");
            sb.AppendLine("                return refreshToken().then(error.request).then((result) => {");
            sb.AppendLine("                    return onSuccess({ result: result, request: error.request });");
            sb.AppendLine("                }).catch((result) => {");
            sb.AppendLine("                    return onError({ result: result, request: error.request });");
            sb.AppendLine("                });");
            sb.AppendLine("            else");
            sb.AppendLine("                return $q.reject(error.result && error.result.data.Message || 'خطای ناشناخته');");
            sb.AppendLine("        }");
            sb.AppendLine("        function refreshToken() {");
            sb.AppendLine("            return $q.resolve().then(() => {");
            sb.AppendLine("                if (localStorage.authorizationData && refreshTokenInprogress === 0) {");
            sb.AppendLine("                    refreshTokenInprogress += 1;");
            sb.AppendLine("                    const token = JSON.parse(localStorage.authorizationData);");
            sb.AppendLine("                    return $http({");
            sb.AppendLine("                        method: 'POST'");
            sb.AppendLine("                        , url: '/User/GetRefreshToken'");
            sb.AppendLine("                        , data: { RefreshToken: token.refresh_token }");
            sb.AppendLine("                    }).then((result) => {");
            sb.AppendLine("                        if (result.data.Success) {");
            sb.AppendLine("                            authenticationService.setCredentials(JSON.parse(result.data.Data));");
            sb.AppendLine("                        }");
            sb.AppendLine("                        else {");
            sb.AppendLine("                            localStorage.clear();");
            sb.AppendLine("                            $('body').html(`<div id='quit-container'><p>${result.data.Description}</p><button type='button' onclick='window.location.href = window.location.origin'>خروج</button></div>`);");
            sb.AppendLine("                        }");
            sb.AppendLine("                    }).finally(() => {");
            sb.AppendLine("                        refreshTokenInprogress -= 1;");
            sb.AppendLine("                    });");
            sb.AppendLine("                }");
            sb.AppendLine("            });");
            sb.AppendLine("        }");
            sb.AppendLine("    }");
            sb.AppendLine("})();");

            return sb.ToString();
        }

        public static string EnumService(string moduleName, List<string> dlls)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("(() => {");
            sb.Append("\t").AppendLine("angular");
            sb.Append("\t\t").AppendLine($".module('{moduleName}')");
            sb.Append("\t\t").AppendLine(".factory('customEnumService', customEnumService);");
            sb.AppendLine("");

            sb.Append("\t").AppendLine("customEnumService.$inject = ['enumService']");
            sb.Append("\t").AppendLine("function customEnumService(enumService) {");

            foreach (string dll in dlls)
            {
                sb.AppendLine().Append("\t\t\t").Append($"//enums in dll: {Path.GetFileName(dll)}").AppendLine();

                var assembly = Assembly.Load(dll);
                var enums = assembly.GetTypes().Where(t => t.IsEnum);
                foreach (Type t in enums)
                {
                    sb.Append("\t\t\t").Append("enumService." + t.Name).Append(" = {");
                    var count = 0;
                    var enumValues = System.Enum.GetValues(t);
                    foreach (var val in enumValues)
                    {
                        count++;
                        Type type = System.Enum.GetUnderlyingType(t);
                        var id = Convert.ChangeType(val, type);
                        string name = System.Enum.GetName(t, id);
                        if (id.ToString() != "0")
                            sb.Append(string.Format("\n{3}'{0}': '{1}'{2}", id, name.Replace("__", "‌").Replace("_", " "), count == enumValues.Length ? "" : ",", count == 1 ? "" : "\t\t\t\t"));
                    }

                    sb.Append(string.Format("\n\t\t\t}}{0}", t == enums.Last() && dll == dlls.Last() ? "" : ",")).AppendLine();
                }
            }

            sb.AppendLine("");
            sb.Append("\t\t").AppendLine("return enumService;");
            sb.Append("\t").AppendLine("}");
            sb.AppendLine("})();");

            return sb.ToString();
        }
    }
}