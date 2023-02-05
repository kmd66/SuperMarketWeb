using Kama.AppCore;
using Kama.Bonyad.Evaluation.ApiClient.Interface;
using Kama.Bonyad.Evaluation.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class InformationController : BaseController
    {
        public InformationController(IInformationService service)
        {
            _service = service;
        }

        readonly IInformationService _service;

        [HttpPost]
        public async Task<JsonResult> Save(Information model)
        {
            var result = await _service.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(InformationVM model)
        {
            var result = await _service.List(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Delete(Information model)
        {
            return Json(Result.Failure(message: "اجازه انجام این کار وجود ندارد"));
        }

        [HttpPost]
        public async Task<JsonResult> AddClassificationInformation(Information model)
        {
            var result = await _service.AddClassificationInformation(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> ListClassificationInformation(InformationVM model)
        {
            var result = await _service.ListClassificationInformation(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> DeleteClassificationInformation(Information model)
        {
            var result = await _service.DeleteClassificationInformation(model);
            return Json(result);
        }

    }
}