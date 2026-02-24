import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SalaryRecord } from '../backend';

interface SalaryHistoryTableProps {
  history: SalaryRecord[];
}

export default function SalaryHistoryTable({ history }: SalaryHistoryTableProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const sortedHistory = [...history].sort((a, b) => {
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
            <TableHead className="font-semibold text-right">Base Salary</TableHead>
            <TableHead className="font-semibold text-right">Bonuses</TableHead>
            <TableHead className="font-semibold text-right">Compensation</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
            <TableHead className="font-semibold">Payment Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHistory.map((record, index) => (
            <TableRow key={index} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">
                {new Date(Number(record.year), Number(record.month) - 1).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </TableCell>
              <TableCell className="text-right">${Number(record.salary).toLocaleString()}</TableCell>
              <TableCell className="text-right">${Number(record.bonuses).toLocaleString()}</TableCell>
              <TableCell className="text-right">${Number(record.compensation).toLocaleString()}</TableCell>
              <TableCell className="text-right font-semibold text-primary">
                ${Number(record.totalCompensation).toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(record.paymentDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
