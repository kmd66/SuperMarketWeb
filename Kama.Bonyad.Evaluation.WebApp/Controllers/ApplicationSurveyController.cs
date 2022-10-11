using Kama.Bonyad.Evaluation.WebApp.Tools;
using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class ApplicationSurveyController : BaseController
    {
        public ApplicationSurveyController(Organization.ApiClient.Interface.IApplicationSurveyService applicationSurveyService)
        {
            _applicationSurveyService = applicationSurveyService;
        }

        readonly Organization.ApiClient.Interface.IApplicationSurveyService _applicationSurveyService;


        [HttpPost]
        public async Task<JsonResult> List(Organization.Core.Model.ApplicationSurveyListVM model)
        {
            var result = await _applicationSurveyService.List(model);
            return Json(result);
        }
    }
}