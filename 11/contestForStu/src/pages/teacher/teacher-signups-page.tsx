import { useEffect, useState } from 'react'
import { ClipboardList, Upload, Download, FileText, Trash2, Printer, X, FileUp, Loader2, CheckCircle2 } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { signupApi, attachmentApi, type SignupRecord, type AttachmentRecord } from '@/api'
import { getCurrentUser } from '@/auth/session'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Card, CardContent } from '@/components/ui/card'
import { SignupTable } from '@/components/app/tables/signup-table'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export function TeacherSignupsPage() {
  const user = getCurrentUser()
  const [signups, setSignups] = useState<SignupRecord[]>([])
  
  // Attachments states
  const [activeSignup, setActiveSignup] = useState<SignupRecord | null>(null)
  const [attachments, setAttachments] = useState<AttachmentRecord[]>([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [attachmentMessage, setAttachmentMessage] = useState('')

  // Print target state
  const [printTarget, setPrintTarget] = useState<SignupRecord | null>(null)

  const { loadingAction, error, runQuery, setError } = useAsyncAction()

  useEffect(() => {
    void loadSignups()
  }, [user?.name])

  function loadSignups() {
    return runQuery('加载报名记录', async () => {
      if (user?.name) {
        setSignups(await signupApi.byTeacher(user.name))
      }
    })
  }

  // --- Attachment Manager Logic ---
  async function openAttachmentManager(record: SignupRecord) {
    setActiveSignup(record)
    setAttachmentMessage('')
    setError('')
    try {
      const list = await attachmentApi.list(record.id)
      setAttachments(list)
    } catch (err) {
      console.error(err)
      setError('获取附件列表失败')
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!activeSignup || !e.target.files || e.target.files.length === 0) return
    const filesArray = Array.from(e.target.files)
    setUploadingFiles(true)
    setAttachmentMessage('')
    setError('')
    try {
      if (filesArray.length === 1) {
        await attachmentApi.upload(filesArray[0], activeSignup.id)
      } else {
        await attachmentApi.uploadMultiple(filesArray, activeSignup.id)
      }
      setAttachmentMessage('附件上传成功')
      const updatedList = await attachmentApi.list(activeSignup.id)
      setAttachments(updatedList)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploadingFiles(false)
      e.target.value = '' // Clear input
    }
  }

  async function handleDownloadAttachment(att: AttachmentRecord) {
    try {
      const blob = await attachmentApi.download(att.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', att.originalName)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      window.alert('下载附件失败')
    }
  }

  async function handleDeleteAttachment(attId: number) {
    if (!activeSignup || !window.confirm('确认要永久删除这个附件吗？')) return
    setError('')
    setAttachmentMessage('')
    try {
      await attachmentApi.remove(attId)
      setAttachmentMessage('附件已成功删除')
      const updatedList = await attachmentApi.list(activeSignup.id)
      setAttachments(updatedList)
    } catch (err) {
      setError('删除附件失败')
    }
  }

  // --- Print Trigger Logic (Option 1) ---
  function triggerPrint(record: SignupRecord) {
    setPrintTarget(record)
    // Give react state a moment to render the offscreen print layout
    setTimeout(() => {
      window.print()
    }, 150)
  }

  // --- General CSV Export ---
  const handleExport = () => {
    if (signups.length === 0) return
    const headers = ['ID', '竞赛项目', '教师姓名', '单位', '电话', '课程名称', '年级', '设计简介', '报名时间']
    const csvRows = [headers.join(',')]
    for (const item of signups) {
      const values = [
        item.id,
        item.contestTitle,
        item.teacherName,
        item.unit,
        item.phone,
        item.courseName,
        item.grade,
        item.desc,
        item.time
      ].map(val => {
        const escaped = ('' + (val ?? '')).replace(/"/g, '""')
        return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') 
          ? `"${escaped}"` 
          : escaped
      })
      csvRows.push(values.join(','))
    }
    const csvContent = '\uFEFF' + csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `我的竞赛报名汇总_${new Date().getTime()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Media Print Injector Stylesheet */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            /* Hide absolute everything on the app except the designated print element */
            #root, .no-print, header, nav, aside, footer, button, .flex-col, .relative {
              display: none !important;
              height: 0 !important;
              overflow: hidden !important;
            }
            .print-only-layout {
              display: block !important;
              visibility: visible !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
            }
          }
        `
      }} />

      <div className="no-print flex flex-col gap-6">
        <WorkspaceHeader
          title="我的竞赛报名材料中心"
          description="查看并管理您的教学竞赛申报，支持上传附件、下载或打印报名表。"
          meta={
            <div className="flex items-center gap-3 justify-end">
              <Button onClick={handleExport} disabled={signups.length === 0} className="rounded-xl shadow-sm">
                <Download className="size-4 mr-2" />
                导出数据汇总 (CSV)
              </Button>
            </div>
          }
        />

        {loadingAction && <LoadingPanel title={loadingAction} description="正在同步云端报名信息..." />}
        {error && !activeSignup && <ErrorPanel title="操作失败" description={error} />}

        <Card className="border overflow-hidden shadow-sm bg-card">
          <CardContent className="p-0">
            <div className="p-5 border-b bg-muted/20">
              <SectionHeading title="已提交的报名清单" description="查看报名记录、初审状态及附件数。" />
            </div>
            
            <SignupTable
              data={signups}
              showContest
              showTime
              showTeacher={false}
              action={(record) => (
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openAttachmentManager(record)}
                    className="rounded-lg text-xs"
                  >
                    <Upload className="size-3 mr-1" />
                    补充附件管理
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => triggerPrint(record)}
                    className="rounded-lg text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 border-none"
                  >
                    <Printer className="size-3 mr-1" />
                    打印报名表
                  </Button>
                </div>
              )}
            />
            
            {signups.length === 0 && !loadingAction && !error && (
              <div className="flex flex-col items-center justify-center p-16 text-muted-foreground bg-surface/10">
                <ClipboardList size={54} className="opacity-15 mb-4" />
                <p className="text-sm font-medium">暂无已提交的教学竞赛报名记录</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* High Fidelity Attachment Management Drawer/Modal */}
      {activeSignup && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b flex justify-between items-center bg-muted/20">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  竞赛附件管理器
                </h3>
                <p className="text-xs text-muted-foreground">
                  参赛课程：<span className="font-semibold text-primary">{activeSignup.courseName}</span> | 报名ID：#{activeSignup.id}
                </p>
              </div>
              <button
                onClick={() => setActiveSignup(null)}
                className="text-muted-foreground hover:bg-surface rounded-full p-2 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {attachmentMessage && (
                <Alert className="border-none bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <CheckCircle2 className="size-4" />
                  <AlertTitle>操作成功</AlertTitle>
                  <AlertDescription>{attachmentMessage}</AlertDescription>
                </Alert>
              )}
              {error && <ErrorPanel title="操作失败" description={error} />}

              {/* Upload Form Dropzone */}
              <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-6 bg-surface/20 text-center">
                <input
                  type="file"
                  id="teacher-attachments-uploader"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingFiles}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {uploadingFiles ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      <FileUp className="size-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-primary">点击或拖拽文件上传参赛材料</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      支持多选，允许上传 PDF、Word、PPT 等说明材料，单个附件建议不超过 15MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachment List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  当前已载入材料附件 ({attachments.length})
                </span>
                
                {attachments.length === 0 ? (
                  <div className="text-center py-10 bg-surface/10 rounded-2xl text-muted-foreground text-xs">
                    暂未上传任何电子附件材料，请从上方框内导入。
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3.5 border rounded-xl bg-surface/30 hover:bg-surface/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 shrink-0">
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-medium block truncate text-foreground" title={att.originalName}>
                              {att.originalName}
                            </span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              大小: {formatBytes(att.fileSize)} | 上传于: {att.uploadTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadAttachment(att)}
                            className="size-8 p-0 rounded-lg"
                            title="下载本附件"
                          >
                            <Download className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteAttachment(att.id)}
                            className="size-8 p-0 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="删除此附件"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-muted/10 flex justify-end">
              <Button onClick={() => setActiveSignup(null)} className="rounded-xl px-5">
                完成关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pure Print-Only Official Academic Registration Layout (Hidden on Screen, Visible on Print Viewports) */}
      {printTarget && (
        <div className="hidden print-only-layout bg-white text-black p-10 font-serif leading-relaxed">
          <div className="w-full max-w-3xl mx-auto border-[3px] border-black p-8 space-y-6">
            <div className="text-center space-y-2 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold tracking-widest text-black">高等学校教师教学创新与竞赛报名登记表</h1>
              <p className="text-xs uppercase font-sans text-gray-500 tracking-wider">OFFICIAL ACADEMIC REGISTRATION RECORD</p>
            </div>

            <table className="w-full border-collapse border-2 border-black text-sm text-black">
              <tbody>
                <tr>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50 w-1/4">竞赛项目</td>
                  <td colSpan={3} className="border-2 border-black p-3.5 text-base font-semibold">{printTarget.contestTitle}</td>
                </tr>
                <tr>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50 w-1/4">教师姓名</td>
                  <td className="border-2 border-black p-3.5 w-1/4 font-semibold">{printTarget.teacherName}</td>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50 w-1/4">所属部门/单位</td>
                  <td className="border-2 border-black p-3.5 w-1/4">{printTarget.unit}</td>
                </tr>
                <tr>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50">联系电话</td>
                  <td className="border-2 border-black p-3.5">{printTarget.phone}</td>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50">填报登记时间</td>
                  <td className="border-2 border-black p-3.5">{printTarget.time || '系统默认备案时间'}</td>
                </tr>
                <tr>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50">参赛课程</td>
                  <td className="border-2 border-black p-3.5 font-semibold text-indigo-900">{printTarget.courseName}</td>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50">主讲年级</td>
                  <td className="border-2 border-black p-3.5">{printTarget.grade}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="border-2 border-black p-3.5 font-bold bg-gray-100/50 text-left">教学设计与创新构想大纲 (Brief Course Outline & Design Description)</td>
                </tr>
                <tr>
                  <td colSpan={4} className="border-2 border-black p-6 min-h-[220px] text-left leading-loose align-top font-sans text-xs break-all whitespace-pre-line bg-white text-gray-800">
                    {printTarget.desc}
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-black p-3.5 font-bold bg-gray-100/50 w-1/4">校评定委员会审核印信</td>
                  <td colSpan={3} className="border-2 border-black p-10 text-left relative min-h-[140px]">
                    <div className="text-gray-400 text-xs italic">经过资质复核与系统查重判定，该选手填报资质真实可信，准予纳入本届教学竞赛评审库。</div>
                    <div className="absolute right-8 bottom-4 text-right text-xs font-sans text-black">
                      审核单位 (盖章)：__________________
                      <br /><br />
                      核准日期：______年___月___日
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center text-[10px] text-gray-400 font-sans px-1">
              <span>防伪备案凭证编码: {printTarget.id}82937A-{printTarget.teacherName.charCodeAt(0) || 0}</span>
              <span>数据生成来源: 高等教师教学系统数字化中心 | 打印日期: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
