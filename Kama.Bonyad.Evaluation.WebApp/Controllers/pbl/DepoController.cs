using Kama.AppCore;
using Kama.Bonyad.Evaluation.ApiClient.Interface;
using Kama.Bonyad.Evaluation.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class DepoController : BaseController
    {
        public DepoController(IDepoService service)
        {
            _service = service;
        }

        readonly IDepoService _service;

        [HttpPost]
        public async Task<JsonResult> EnterStorage(Depo model)
        {
            var result = await _service.EnterStorageAsync(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Delete(Depo model)
        {
            return Json(Result.Failure(message: "اجازه انجام این کار وجود ندارد"));
            var result = await _service.Delete(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Depo model)
        {
            var result = await _service.Get(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(DepoVM model)
        {
            var result = await _service.List(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> DepoIndexList(DepoVM model)
        {
            var result = await _service.DepoIndexList(model);
            return Json(result);
        }

    }
}