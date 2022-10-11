using Kama.Bonyad.Evaluation.WebApp.Tools;
using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class ApplicationSurveyAnswerController : BaseController
    {
        public ApplicationSurveyAnswerController(Organization.ApiClient.Interface.IApplicationSurveyAnswerService applicationSurveyAnswerService)
        {
            _applicationSurveyAnswerService = applicationSurveyAnswerService;
        }

        readonly Organization.ApiClient.Interface.IApplicationSurveyAnswerService _applicationSurveyAnswerService;


        [HttpPost]
        public async Task<JsonResult> Get(Guid id)
        {
            var result = await _applicationSurveyAnswerService.Get(id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(Organization.Core.Model.ApplicationSurveyAnswerListVM model)
        {
            var result = await _applicationSurveyAnswerService.List(model);
            return Json(result);
        }
    }
}