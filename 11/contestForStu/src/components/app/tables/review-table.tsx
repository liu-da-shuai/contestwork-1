import type { ReactNode } from 'react'
import { type ReviewRecord } from '@/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ReviewTableProps {
  data: ReviewRecord[]
  action?: (record: ReviewRecord) => ReactNode
}

export function ReviewTable({ data, action }: ReviewTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>教师</TableHead>
          <TableHead>课程</TableHead>
          <TableHead>评分</TableHead>
          {action && <TableHead className="text-right">操作</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.teacherName}</TableCell>
            <TableCell>{item.courseName}</TableCell>
            <TableCell>{item.score}</TableCell>
            {action && <TableCell className="text-right">{action(item)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
