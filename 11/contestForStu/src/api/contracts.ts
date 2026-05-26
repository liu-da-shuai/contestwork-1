export const API_ENDPOINTS = {
  login: '/login',
  register: '/register',
  adminUsers: '/admin/user',
  adminUserDetail: (id: number | string) => `/admin/user/${id}`,
  adminUserPassword: '/admin/user/password',
  contestList: '/contest/list',
  contestDetail: (id: number | string) => `/contest/detail/${id}`,
  contestAdd: '/contest/add',
  contestUpdate: '/contest/update',
  contestDelete: (id: number | string) => `/contest/delete/${id}`,
  contestSearch: '/contest/search',
  signupAdd: '/signup/add',
  signupList: '/signup/list',
  signupDetail: (id: number | string) => `/signup/detail/${id}`,
  signupUpdate: '/signup/update',
  signupDelete: (id: number | string) => `/signup/delete/${id}`,
  signupByContest: '/signup/contest',
  signupByTeacher: '/signup/teacher',
  reviewAdd: '/review/add',
  reviewList: '/review/list',
  reviewDetail: (id: number | string) => `/review/detail/${id}`,
  reviewUpdate: '/review/update',
  reviewDelete: (id: number | string) => `/review/delete/${id}`,
  reviewByContest: '/review/contest',
  reviewByTeacher: '/review/teacher',
  awardAdd: '/award/add',
  awardList: '/award/list',
  awardDetail: (id: number | string) => `/award/detail/${id}`,
  awardUpdate: '/award/update',
  awardDelete: (id: number | string) => `/award/delete/${id}`,
  awardByTeacher: '/award/teacher',
  awardByTitle: '/award/title',
  statisticsContest: '/statistics/contest',
  statisticsTeacher: '/statistics/teacher',
  statisticsOverall: '/statistics/overall',
  
  reviewBatchAssign: '/review/batch/assign',
  reviewPending: '/review/teacher/pending',
  reviewProgress: '/review/progress',

  // 附件管理 (后端新版)
  attachmentUpload: '/attachment/upload',
  attachmentUploadMultiple: '/attachment/upload-multiple',
  attachmentList: '/attachment/list',
  attachmentDownload: (id: number | string) => `/attachment/download/${id}`,
  attachmentDelete: (id: number | string) => `/attachment/delete/${id}`,

  // 双盲评审
  blindReviewAssign: '/blind-review/assign',
  blindReviewList: '/blind-review/list',
  blindReviewDetail: (id: number | string) => `/blind-review/detail/${id}`,
  blindReviewSubmit: '/blind-review/submit',
  blindReviewProgress: '/blind-review/progress',
  blindReviewDelete: (id: number | string) => `/blind-review/delete/${id}`,

  // 作品查重
  plagiarismCreate: '/plagiarism/create',
  plagiarismList: '/plagiarism/list',
  plagiarismDetail: (id: number | string) => `/plagiarism/detail/${id}`,
  plagiarismResults: '/plagiarism/results',
  plagiarismRun: (id: number | string) => `/plagiarism/run/${id}`,

  // 打印功能
  printSignup: '/print/signup',
  printSignupList: '/print/signup-list',

  // 进度与个人中心
  progressReview: '/progress/review',
  progressContests: '/progress/contests',
  progressTeacher: '/progress/teacher',
  personalCenter: '/personal/center',

  // 数据备份与还原
  backupCreate: '/backup/create',
  backupList: '/backup/list',
  backupDownload: '/backup/download',
  backupDelete: '/backup/delete',
  backupRestore: '/backup/restore',
} as const


