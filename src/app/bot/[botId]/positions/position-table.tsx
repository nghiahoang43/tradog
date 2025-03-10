"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Asset, Direction } from "@alpacahq/typescript-sdk";
// import  from '@alpacahq/typescript-sdk'

type Position = {
  asset_id: string;
  exchange: string;
  asset_class: string;
  symbol: string;
  asset_marginable: boolean;
  qty: string;
  avg_entry_price: string;
  side: Direction;
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
  qty_available: string;
};

export const columns: ColumnDef<Position>[] = [
  {
    accessorKey: "symbol",
    header: "Asset",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "current_price",
    header: "Price",
  },
];

export const PositionTable = () => {
  const [data, setData] = useState<Position[]>([]);
  const getPositions = async () => {
    const response = await fetch("/api/alpaca/position/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result: { success: boolean; positions: Position[] } =
      await response.json();
    setData(result.positions);
    console.log("Positions:", data);
  };

  useEffect(() => {
    getPositions();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
