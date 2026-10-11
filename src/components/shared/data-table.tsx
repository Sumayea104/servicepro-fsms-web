import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

/** Generic responsive table: scrolls horizontally on small screens instead of breaking layout. */
export function DataTable<T extends { id: string }>({ columns, rows, empty }: { columns: Column<T>[]; rows: T[]; empty: React.ReactNode }) {
  if (rows.length === 0) return <>{empty}</>;
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col" className={cn('whitespace-nowrap px-4 py-3.5 font-semibold', c.className)}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-accent/40">
              {columns.map((c) => (
                <td key={c.header} className={cn('px-4 py-3.5 align-middle', c.className)}>{c.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
