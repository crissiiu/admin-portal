"use client";

import {
  Empty,
  List as AntdList,
  Table as AntdTable,
  type ListProps as AntdListProps,
  type SpinProps,
  type TableProps as AntdTableProps
} from "antd";
import type { Key, ReactNode } from "react";

import { Loading } from "../loading";
import { cn } from "../../lib/cn";

export type DataTableDensity = "compact" | "comfortable" | "spacious";

const tableSizes: Record<DataTableDensity, AntdTableProps<object>["size"]> = {
  compact: "small",
  comfortable: "middle",
  spacious: "large"
};

function getLoadingIndicator(loading: boolean | SpinProps | undefined) {
  if (!loading) {
    return loading;
  }

  const indicator = <Loading size="md" tone="primary" />;

  if (typeof loading === "boolean") {
    return {
      indicator
    };
  }

  return {
    ...(loading as SpinProps),
    indicator
  };
}

export interface DataTableProps<TRecord extends object>
  extends Omit<AntdTableProps<TRecord>, "dataSource" | "locale" | "size"> {
  data: TRecord[];
  density?: DataTableDensity;
  emptyText?: ReactNode;
}

export interface DataListProps<TItem extends object>
  extends Omit<AntdListProps<TItem>, "dataSource" | "locale" | "renderItem"> {
  emptyText?: ReactNode;
  getKey: (item: TItem) => Key;
  items: TItem[];
  renderItem: (item: TItem, index: number) => ReactNode;
}

export function DataTable<TRecord extends object>({
  className,
  data,
  density = "comfortable",
  emptyText = "Không có dữ liệu",
  loading,
  pagination = false,
  rowKey,
  scroll,
  ...props
}: DataTableProps<TRecord>) {
  return (
    <AntdTable<TRecord>
      className={cn("sb-data-table", className)}
      dataSource={data}
      locale={{
        emptyText: <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }}
      loading={getLoadingIndicator(loading)}
      pagination={pagination}
      rowKey={rowKey}
      scroll={{
        x: "max-content",
        ...scroll
      }}
      size={tableSizes[density]}
      {...props}
    />
  );
}

export function DataList<TItem extends object>({
  className,
  emptyText = "Không có dữ liệu",
  getKey,
  items,
  loading,
  renderItem,
  ...props
}: DataListProps<TItem>) {
  return (
    <AntdList<TItem>
      className={cn("sb-data-list", className)}
      dataSource={items}
      locale={{
        emptyText: <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }}
      loading={getLoadingIndicator(loading)}
      renderItem={(item, index) => (
        <AntdList.Item key={getKey(item)} className="sb-data-list__item">
          {renderItem(item, index)}
        </AntdList.Item>
      )}
      {...props}
    />
  );
}
