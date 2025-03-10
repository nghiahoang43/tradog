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
import { useConvex } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useBotId } from "@/hooks/useBotId";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
// import  from '@alpacahq/typescript-sdk'

export type Order = Doc<"orders"> & { asset: Doc<"assets"> };

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // 12-hour format
  });
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "asset.symbol",
    header: "Symbol",
    cell: ({ row }) => row.original.asset.symbol,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatTimestamp(row.original.createdAt),
  },
  {
    accessorKey: "executedAt",
    header: "Excuted At",
    cell: ({ row }) => {
      if (row.original.executedAt) {
        formatTimestamp(row.original.executedAt);
      }
    },
  },
];

export const OrderTable = () => {
  const client = useConvex();
  const botId = useBotId();
  const [orders, setOrders] = useState<Order[]>([]);
  const getPositions = async () => {
    const ordersData = await client.query(api.orders.getAllByBotId, {
      botId,
    });
    if (!ordersData) {
      setOrders([]);
      return;
    }
    setOrders(ordersData as Order[]);
  };

  useEffect(() => {
    getPositions();
  }, []);

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <div>
        <Button>Force refresh</Button>
      </div>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
