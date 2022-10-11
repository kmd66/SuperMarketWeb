//using Kama.Bonyad.Evaluation.WebApp.Tools;
//using System;
//using System.Threading.Tasks;
//using System.Web.Mvc;

//namespace Kama.Bonyad.Evaluation.WebApp.Controllers
//{
//    public class ApplicationSurveyParticipantController : BaseController
//    {
//        public ApplicationSurveyParticipantController(Organization.ApiClient.Interface.IApplicationSurveyParticipantService applicationSurveyParticipantService)
//        {
//            _applicationSurveyParticipantService = applicationSurveyParticipantService;
//        }

//        readonly Organization.ApiClient.Interface.IApplicationSurveyParticipantService _applicationSurveyParticipantService;

//        [HttpPost]
//        [Authorize]
//        public async Task<JsonResult> Add(Organization.Core.Model.ApplicationSurveyParticipant model)
//        {
//            var result = await _applicationSurveyParticipantService.Add(model);
//            return Json(result);
//        }

//        [HttpPost]
//        [Authorize]
//        public async Task<JsonResult> Edit(Organization.Core.Model.ApplicationSurveyParticipant model)
//        {
//            var result = await _applicationSurveyParticipantService.Edit(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Get(Guid id)
//        {
//            var result = await _applicationSurveyParticipantService.Get(id);
//            return Json(result);
//        }

//        [HttpPost]
//        [Authorize]
//        public async Task<JsonResult> List(Organization.Core.Model.ApplicationSurveyParticipantListVM model)
//        {
//            var result = await _applicationSurveyParticipantService.List(model);
//            return Json(result);
//        }
//    }
//}