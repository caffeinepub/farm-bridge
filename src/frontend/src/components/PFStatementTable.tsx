import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PFHistoryRecord } from '../backend';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PFStatementTableProps {
  statements: PFHistoryRecord[];
}

export default function PFStatementTable({ statements }: PFStatementTableProps) {
  const sortedStatements = [...statements].sort((a, b) => {
    if (Number(a.year) !== Number(b.year)) {
      return Number(b.year) - Number(a.year);
    }
    return Number(b.month) - Number(a.month);
  });

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Period</TableHead>
            <TableHead className="font-semibold text-right">Contribution</TableHead>
            <TableHead className="font-semibold text-right">Withdrawal</TableHead>
            <TableHead className="font-semibold text-right">Interest</TableHead>
            <TableHead className="font-semibold text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStatements.map((record, index) => (
            <TableRow key={index} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">
                {new Date(Number(record.year), Number(record.month) - 1).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </TableCell>
              <TableCell className="text-right">
                <span className="flex items-center justify-end gap-1 text-success">
                  <TrendingUp className="h-3 w-3" />
                  ${Number(record.contributionAmount).toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {Number(record.withdrawal) > 0 ? (
                  <span className="flex items-center justify-end gap-1 text-destructive">
                    <TrendingDown className="h-3 w-3" />
                    ${Number(record.withdrawal).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right text-accent">
                ${Number(record.accruedInterest).toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-semibold text-primary">
                ${Number(record.balance).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
