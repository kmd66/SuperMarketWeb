(() => {
	angular
		.module('evaluation')
		.factory('customEnumService', customEnumService);

	customEnumService.$inject = ['enumService']
	function customEnumService(enumService) {

			//enums in dll: Kama.Organization.Core.Model
			enumService.OrganizationCommands = {
			},
			enumService.EnableState = {
				'1': 'غیر فعال',
				'2': 'فعال'
			},
			enumService.DynamicReportFieldType = {
				'1': 'عدد',
				'2': 'رشته',
				'3': 'چند مقدار',
				'4': 'تاریخ'
			},
			enumService.DynamicPermissionDetailType = {
				'1': 'ParentDepartment',
				'2': 'Department',
				'3': 'Province',
				'4': 'DepartmentType',
				'9': 'PositionType',
				'10': 'Position'
			},
			enumService.LoginType = {
				'1': 'نام کاربری و کلمه عبور',
				'2': 'تلفن همراه و کلمه عبور',
				'3': 'تلفن همراه و کد امنیتی',
				'4': 'ایمیل و کلمه عبور',
				'5': 'ایمیل و کد امنیتی'
			},
			enumService.ContactDetailType = {
				'1': 'تلفن',
				'2': 'موبایل',
				'3': 'نمابر',
				'4': 'ایمیل',
				'5': 'آدرس',
				'6': 'کد پستی'
			},
			enumService.OrganLawType = {
				'1': 'مشمول قانون مدیریت خدمات کشوری',
				'2': 'غیر مشمول قانون مدیریت خدمات کشوری',
				'3': 'ترکیبی'
			},
			enumService.EmploymentRegulationsType = {
				'1': 'مشمول قانون مدیریت خدمات کشوری',
				'2': 'تابع ضوابط و مقررات قانون مدیریت خدمات کشوری',
				'3': 'مشمول قانون کار',
				'4': 'مشمول آیین نامه استخدامی هیات امنایی تابع وزارت علوم',
				'5': 'مشمول آیین نامه استخدامی هیات امنایی تابع وزارت بهداشت',
				'6': 'نهاد عمومی غیر دولتی',
				'7': 'مشمول آیین نامه استخدامی فرهنگستان های کشور',
				'8': 'مشمول قوانین و مقررات خاص',
				'9': 'مشمول مقررات استخدامی شهرداری ها',
				'10': 'قوانین و مقررات استخدامی ترکیبی',
				'11': 'مشمول قوانین و مقررات خاص قوه مقننه',
				'12': 'مشمول قانون استخدام کشوری'
			},
			enumService.ClientType = {
				'1': 'JavaScript',
				'2': 'Native'
			},
			enumService.CommandType = {
				'1': 'App',
				'2': 'Menu',
				'3': 'Page',
				'7': 'State',
				'10': 'Tab',
				'20': 'Element'
			},
			enumService.AnnouncementType = {
				'1': 'اخبار',
				'2': 'اطلاعیه'
			},
			enumService.AnnouncementPriorityType = {
				'1': 'زیاد',
				'2': 'متوسط',
				'3': 'پایین'
			},
			enumService.EnableOrDisable = {
				'1': 'غیر فعال',
				'2': 'فعال'
			},
			enumService.ArchivedType = {
				'1': 'NotArchived',
				'2': 'Archived'
			},
			enumService.OrganizationAttachmentType = {
				'1': 'فایل پیوست اعلان',
				'2': 'تصویر اعلان',
				'3': 'تصویر کاربر'
			},
			enumService.DepartmentType = {
				'1': 'سازمان',
				'20': 'دفتر املاک',
				'30': 'محله'
			},
			enumService.UserType = {
				'1': 'کاربر درون سازمانی',
				'2': 'کاربر برون سازمانی'
			},
			enumService.ApplicationStatus = {
				'1': 'فعال',
				'2': 'غیر فعال'
			},
			enumService.PlaceType = {
				'1': 'قاره',
				'2': 'کشور',
				'3': 'استان',
				'4': 'شهرستان',
				'5': 'بخش',
				'6': 'شهر',
				'7': 'دهستان',
				'8': 'روستا'
			},
			enumService.PositionType = {
				'100': 'راهبر'
			},
			enumService.AgreementPositionType = {
				'1': 'کاربر استان',
				'5': 'کارشناس توافقات',
				'10': 'مدیر کل توافقات',
				'15': 'مدیر بخش',
				'100': 'راهبر'
			},
			enumService.EvaluationPositionType = {
				'1': 'کاربر استان',
				'10': 'کارشناس طرح و برنامه',
				'20': 'کارشناس تحقیق و استرداد',
				'100': 'راهبر'
			},
			enumService.OmranShomalPositionType = {
				'1': 'کارشناس',
				'100': 'راهبر'
			},
			enumService.SendMessageType = {
				'1': 'Email',
				'2': 'Sms'
			},
			enumService.UserNotificationType = {
				'1': 'Email',
				'2': 'Sms',
				'3': 'Notification'
			},
			enumService.UserNotificationTemplate = {
				'1': 'ForgotPassword',
				'2': 'ResetPassword',
				'3': 'VerifyCellphone',
				'4': 'VerifyEmail',
				'5': 'UserAdded',
				'6': 'PasswordChanged',
				'7': 'UserInNewPosition',
				'8': 'SendForgotPasswordLinkByEmail'
			},
			enumService.SendMessageReasonType = {
				'1': 'ForgotPassword',
				'2': 'ResetPassword',
				'3': 'VerifyCellphone',
				'4': 'VerifyEmail',
				'5': 'UserAdded',
				'6': 'ActivateUser'
			},
			enumService.NotificationPriority = {
'1': 'زیاد',
				'2': 'متوسط',
				'3': 'کم'
			},
			enumService.NotificationType = {
				'1': 'اخبار',
				'2': 'اطلاعیه ها'
			},
			enumService.NotificationState = {
				'1': 'ارسال نشده',
				'2': 'ارسال شده',
				'3': 'آرشیو شده',
				'4': 'حذف شده'
			},
			enumService.NotificationSenderType = {
				'1': 'سامانه',
				'2': 'کاربر'
			},
			enumService.ApplicationSurveyQuestionType = {
				'1': 'بله یا خیر',
				'2': 'تک انتخابی',
				'3': 'چند انتخابی',
				'4': 'متن کوتاه',
				'5': 'متن بلند'
			},
			enumService.AttachmentType = {
'50': 'تصویر امضا کاربر'
			},
			enumService.TicketAnswerState = {
				'1': 'پاسخ داده شده',
				'2': 'پاسخ داده نشده'
			},
			enumService.TicketScore = {
				'1': 'خوب',
				'2': 'متوسط',
				'3': 'ضعیف'
			},
			enumService.TicketState = {
				'1': 'باز است',
				'2': 'بسته شود',
				'3': 'در دست اقدام می باشد'
			},
			enumService.TicketReportState = {
				'1': 'باز',
				'2': 'بسته شده',
				'3': 'در دست اقدام'
			},
			enumService.SurveyAnswerType = {
				'1': 'خیلی خوب',
				'2': 'خوب',
				'3': 'متوسط',
				'4': 'بد',
				'5': 'خیلی بد'
			},
			enumService.ZoneType = {
				'1': 'اینترانت',
				'2': 'اینترنت'
			},
			enumService.BonyadPositionType = {
				'1': 'کاربر استان',
				'5': 'کارشناس',
				'100': 'راهبر'
			},

			//enums in dll: Kama.Bonyad.Evaluation.Core.Model
			enumService.OS = {
				'1': 'windows',
				'2': 'android',
				'3': 'ios',
				'4': 'linux',
				'5': 'mac',
				'5': 'mac',
				'6': 'blackberry os'
			},
			enumService.Browser = {
				'1': 'firefox',
				'2': 'chrome',
				'3': 'opera',
				'4': 'internet explorer',
				'5': 'سایر'
			},
			enumService.DeviceType = {
				'1': 'mobile',
				'2': 'desktop',
				'3': 'smartphone',
				'4': 'tablet',
				'5': 'iPhone',
				'6': 'سایر'
			},
			enumService.ActionState = {
				'1': 'موارد در دست اقدام',
				'2': 'موارد ارسال شده',
				'3': 'موارد نهایی شده',
				'4': 'موارد بایگانی شده',
				'10': 'همه موارد مربوط به کاربر',
				'20': 'همه موارد'
			},
			enumService.DocState = {
				'1': 'انبار'
			},
			enumService.OpinionType = {
				'1': 'تایید',
				'2': 'عدم تایید',
				'3': 'نیاز به اصلاح دارد'
			},
			enumService.SendType = {
				'1': 'ارسال',
				'2': 'عدم تایید',
				'250': 'ارسال توسط سیستم'
			},
			enumService.AttachmentType = {
				'1': 'تصویر دسته بندی',
				'2': 'تصویر دسته کالا'
			},
			enumService.UnitOfMeasureType = {
				'1': 'عدد',
				'2': 'بسته',
				'3': 'کیلو',
				'4': 'متر'
			},
			enumService.SendMessageReasonType = {
				'1': 'ComplaintSentByUser',
				'2': 'ComplaintNotVerifiedByMinister',
				'3': 'VotePublished'
			}

		return enumService;
	}
})();
