using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class MessageController : BaseController
    {
        public MessageController(Organization.ApiClient.Interface.IMessageService messageService)
        {
            _messageService = messageService;
        }

        readonly Organization.ApiClient.Interface.IMessageService _messageService;

        [HttpPost]
        public async Task<JsonResult> Add(Organization.Core.Model.Message model)
        {
            var result = await _messageService.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Edit(Organization.Core.Model.Message model)
        {
            var result = await _messageService.Edit(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> PermanentDelete(Guid Id)
        {
            var result = await _messageService.PermanentDelete(Id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Delete(Guid Id)
        {
            var result = await _messageService.Delete(Id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Seen(Guid Id)
        {
            var result = await _messageService.Seen(Id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Send(Guid Id)
        {
            var result = await _messageService.Send(Id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Guid id)
        {
            var result = await _messageService.Get(id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> ListInBox(Organization.Core.Model.InboxMessageListVM model)
        {
            var result = await _messageService.ListInBox(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> ListOutBox(Organization.Core.Model.OutboxMessageListVM model)
        {
            var result = await _messageService.ListOutBox(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> ListDraft(Organization.Core.Model.DraftMessageListVM model)
        {
            var result = await _messageService.ListDraft(model);
            return Json(result);
        }
    }
}