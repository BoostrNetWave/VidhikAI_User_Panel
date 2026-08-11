import React, { useState } from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface AdminDocumentsProps {
  documents: any[];
}

export function AdminDocuments({ documents = [] }: AdminDocumentsProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    {
      accessorKey: '_id',
      header: 'Doc ID',
      cell: ({ row }: any) => <span className="font-mono text-xs text-muted-foreground font-medium">{String(row.getValue('_id')).substring(0, 8).toUpperCase()}</span>
    },
    {
      accessorKey: 'type',
      header: 'Document Type',
      cell: ({ row }: any) => (
        <span className="font-semibold text-sm text-foreground">{row.getValue('type') || 'Unknown Type'}</span>
      )
    },
    {
      accessorKey: 'user',
      header: 'Owner',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.original.user?.fullName || row.original.user?.email || 'System'}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = (row.getValue('status') || 'created').toLowerCase();
        return (
          <Badge 
            variant="outline" 
            className={`capitalize text-[10px] ${status === 'completed' || status === 'ready' ? 'border-success text-success bg-success/5' : ''}`}
          >
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ row }: any) => (
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(row.getValue('createdAt')).toLocaleString()}
        </span>
      )
    }
  ];

  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting }
  });

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Document Audit Trail</h3>
          <p className="text-sm text-muted-foreground">Comprehensive log of all AI generated and user-uploaded documents.</p>
        </div>
      </div>

      <div className="border border-border rounded-md bg-surface shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 border-b border-border">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                  No documents found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
