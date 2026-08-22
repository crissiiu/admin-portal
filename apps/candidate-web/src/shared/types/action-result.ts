export type ActionResult<TData = undefined> =
  | { ok: true; data: TData }
  | { ok: false; fieldErrors?: Record<string, string[]>; message: string };

