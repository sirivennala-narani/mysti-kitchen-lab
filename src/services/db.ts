import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TableName = keyof Database["public"]["Tables"];

/**
 * Generic, reusable CRUD helpers for any table in the public schema.
 * Works alongside RLS — callers must be authenticated where required.
 */

export type ListOptions = {
  filters?: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
  page?: number;
  pageSize?: number;
  search?: { column: string; query: string };
};

function applyOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  options: ListOptions = {},
) {
  let q = query;
  if (options.filters) {
    for (const [k, v] of Object.entries(options.filters)) {
      if (v === undefined || v === null) continue;
      q = q.eq(k, v);
    }
  }
  if (options.search?.query) {
    q = q.ilike(options.search.column, `%${options.search.query}%`);
  }
  if (options.orderBy) {
    q = q.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true,
    });
  }
  if (options.page !== undefined && options.pageSize) {
    const from = options.page * options.pageSize;
    const to = from + options.pageSize - 1;
    q = q.range(from, to);
  }
  return q;
}

export async function getAll<T = unknown>(
  table: TableName,
  options: ListOptions = {},
): Promise<T[]> {
  const query = applyOptions(supabase.from(table).select("*"), options);
  const { data, error } = await query;
  if (error) {
    console.error(`[db.getAll:${table}]`, error);
    throw error;
  }
  return (data ?? []) as T[];
}

export async function getById<T = unknown>(
  table: TableName,
  id: string | number,
  idColumn = "id",
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(idColumn, id)
    .maybeSingle();
  if (error) {
    console.error(`[db.getById:${table}]`, error);
    throw error;
  }
  return (data as T) ?? null;
}

export async function createRecord<T = unknown>(
  table: TableName,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any,
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .insert(values)
    .select()
    .single();
  if (error) {
    console.error(`[db.createRecord:${table}]`, error);
    throw error;
  }
  return data as T;
}

export async function updateRecord<T = unknown>(
  table: TableName,
  id: string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any,
  idColumn = "id",
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq(idColumn, id)
    .select()
    .single();
  if (error) {
    console.error(`[db.updateRecord:${table}]`, error);
    throw error;
  }
  return data as T;
}

export async function deleteRecord(
  table: TableName,
  id: string | number,
  idColumn = "id",
): Promise<void> {
  const { error } = await supabase.from(table).delete().eq(idColumn, id);
  if (error) {
    console.error(`[db.deleteRecord:${table}]`, error);
    throw error;
  }
}

export async function upsertRecord<T = unknown>(
  table: TableName,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any,
  onConflict?: string,
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .upsert(values, onConflict ? { onConflict } : undefined)
    .select()
    .single();
  if (error) {
    console.error(`[db.upsertRecord:${table}]`, error);
    throw error;
  }
  return data as T;
}