using Kama.AppCore;
using Kama.Bonyad.Evaluation.ApiClient.Interface;
using Kama.Bonyad.Evaluation.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class ItemController : BaseController
    {
        public ItemController(IItemService service)
        {
            _service = service;
        }

        readonly IItemService _service;

        [HttpPost]
        public async Task<JsonResult> Save(Item model)
        {
            dynamic result;
            if (model.GuID == 
                null || model.GuID == Guid.Empty)
                result = await _service.Add(model);
            else
                result = await _service.Edit(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Delete(Item model)
        {
            return Json(Result.Failure(message: "اجازه انجام این کار وجود ندارد"));
            var result = await _service.Delete(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Item model)
        {
            var result = await _service.Get(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(ItemVM model)
        {
            var result = await _service.List(model);
            return Json(result);
        }

    }
}