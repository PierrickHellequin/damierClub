export type OrderParamsType =
  | { field: string; direction?: "asc" | "desc" }
  | undefined;

export function buildOrderParams(
  order: OrderParamsType,
  params: URLSearchParams
) {
  if (!order || !order.field) return;
  // backend actuel: paramètre 'sort' (ex: name ou name,desc suivant évolution possible)
  params.append(
    "sort",
    order.direction && order.direction.toLowerCase() === "desc"
      ? `${order.field},desc`
      : order.field
  );
}

export function buildArrayParams(key: string, values?: (string | number)[]) {
  return (params: URLSearchParams) => {
    if (!values || values.length === 0) return;
    values.forEach((v) => params.append(key, String(v)));
  };
}
