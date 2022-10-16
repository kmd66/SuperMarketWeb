using Kama.AppCore;
using Kama.Bonyad.Evaluation.ApiClient.Interface;
using Kama.Bonyad.Evaluation.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class StockController : BaseController
    {
        public StockController(IStockService service)
        {
            _service = service;
        }

        readonly IStockService _service;

        [HttpPost]
        public async Task<JsonResult> Save(Stock model)
        {
            var result = await _service.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Stock model)
        {
            var result = await _service.Get(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(Stock model)
        {
            var result = await _service.List(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Delete(Product model)
        {
            return Json(Result.Failure(message: "اجازه انجام این کار وجود ندارد"));
        }

    }
}