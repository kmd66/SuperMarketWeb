using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class PositionController : BaseController
    {
        public PositionController(
            Organization.ApiClient.Interface.IPositionService positionService,
            ApiClient.Interface.IPositionService iPositionService)
        {
            _positionService = positionService;
            _iPositionService = iPositionService;

        }

        private readonly Organization.ApiClient.Interface.IPositionService _positionService;
        private readonly ApiClient.Interface.IPositionService _iPositionService;

        [AllowAnonymous]
        [HttpPost]
        public async Task<JsonResult> ListByUser()
        {
            var result = await _positionService.List(new Organization.Core.Model.PositionListVM() { UserID = this.CurrenUserID/*, EnableState = Organization.Core.Model.EnableState.Enable*/ });
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(Organization.Core.Model.PositionListVM position)
        {
            var result = await _positionService.List(position);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Guid id)
        {
            var result = await _positionService.Get(id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Save(Organization.Core.Model.Position model)
        {
            AppCore.Result<Organization.Core.Model.Position> result;

            if (model.ID == Guid.Empty)
            {
                model.ApplicationID = this.ApplicationID;
                result = await _positionService.Add(model);
            }
            else
                result = await _positionService.Edit(model);

            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Remove(Guid positionId)
        {
            var result = await _positionService.Delete(positionId);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> RemoveUser(Guid positionId)
        {
            var result = await _positionService.RemoveUser(positionId);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetPermissions(Guid positionId)
        {
            var result = await _positionService.GetPermissions(positionId);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> SetDefault(Guid positionId)
        {
            var result = await _positionService.SetDefault(positionId);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> ListInAllApplications(Organization.Core.Model.PositionListVM listVm)
        {
            var result = await _positionService.ListInAllApplications(listVm);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetOnlineCount()
        {
            var result = await _positionService.GetOnlineCount();
            return Json(result);
        }
    }
}