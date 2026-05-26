import type { ReactNode } from 'react'
import { type SignupRecord } from '@/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface SignupTableProps {
  data: SignupRecord[]
  showContest?: boolean
  showTime?: boolean
  showUnit?: boolean
  showTeacher?: boolean
  action?: (record: SignupRecord) => ReactNode
}

export function SignupTable({
  data,
  showContest,
  showTime,
  showUnit,
  showTeacher = true,
  action,
}: SignupTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showContest && <TableHead>竞赛</TableHead>}
          {showTeacher && <TableHead>教师</TableHead>}
          <TableHead>课程</TableHead>
          {showUnit && <TableHead>单位</TableHead>}
          {showTime && <TableHead>报名日期</TableHead>}
          {action && <TableHead className="text-right">操作</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {showContest && <TableCell className="font-medium">{item.contestTitle}</TableCell>}
            {showTeacher && <TableCell className={showContest ? '' : 'font-medium'}>{item.teacherName}</TableCell>}
            <TableCell>{item.courseName}</TableCell>
            {showUnit && <TableCell>{item.unit}</TableCell>}
            {showTime && <TableCell>{item.time || '未填写'}</TableCell>}
            {action && <TableCell className="text-right">{action(item)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
