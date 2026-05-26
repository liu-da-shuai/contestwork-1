import type { ReactNode } from 'react'
import { type Contest } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ContestTableProps {
  data: Contest[]
  action?: (record: Contest) => ReactNode
}

export function ContestTable({ data, action }: ContestTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>竞赛名称</TableHead>
          <TableHead>时间</TableHead>
          <TableHead>状态</TableHead>
          {action && <TableHead className="text-right">操作</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>
              <Badge variant="secondary">{item.status}</Badge>
            </TableCell>
            {action && <TableCell className="text-right">{action(item)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
