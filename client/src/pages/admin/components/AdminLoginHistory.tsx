import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    SortingState
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface AdminLoginHistoryProps {
    history: any[];
}

export function AdminLoginHistory({ history = [] }: AdminLoginHistoryProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = [
        {
            accessorKey: 'createdAt',
            header: 'Timestamp',
            cell: ({ row }: any) => {
                return (
                    <div className="font-mono text-sm whitespace-nowrap">
                        {format(new Date(row.getValue('createdAt')), 'MMM dd, yyyy HH:mm:ss')}
                    </div>
                );
            }
        },
        {
            accessorKey: 'email',
            header: 'Email / User',
            cell: ({ row }: any) => {
                const user = row.original.user;
                return (
                    <div>
                        <div className="font-medium text-foreground">{row.getValue('email')}</div>
                        {user && <div className="text-xs text-muted-foreground">{user.fullName}</div>}
                    </div>
                );
            }
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }: any) => {
                const role = row.getValue('role') || row.original.user?.role || 'Unknown';
                return (
                    <Badge variant="outline" className="capitalize text-xs font-semibold">
                        {role}
                    </Badge>
                );
            }
        },
        {
            accessorKey: 'ipAddress',
            header: 'IP Address',
            cell: ({ row }: any) => <div className="font-mono text-sm">{row.getValue('ipAddress') || 'N/A'}</div>
        },
        {
            accessorKey: 'userAgent',
            header: 'Device / Browser',
            cell: ({ row }: any) => (
                <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={row.getValue('userAgent')}>
                    {row.getValue('userAgent') || 'Unknown'}
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }: any) => {
                const status = row.getValue('status');
                return (
                    <Badge className={`text-[10px] font-bold uppercase ${status === 'success' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                        {status}
                    </Badge>
                );
            }
        }
    ];

    const table = useReactTable({
        data: history,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 15,
            },
            sorting: [{ id: 'createdAt', desc: true }]
        }
    });

    return (
        <Card className="shadow-sm border-border animate-in fade-in-50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">Security Audit Log</CardTitle>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search IP, email, role..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9 bg-background border-input text-sm h-9"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-border bg-surface overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-10">
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-1" : ""}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: <ChevronUp className="h-3 w-3" />,
                                                            desc: <ChevronDown className="h-3 w-3" />,
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="border-border transition-colors hover:bg-muted/30"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No login records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}{' '}
                        of {table.getFilteredRowModel().rows.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 border-border"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-8 border-border"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
