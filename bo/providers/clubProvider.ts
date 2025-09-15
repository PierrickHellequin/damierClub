import { apiProvider } from "./apiProvider";
import { Club } from "@/types/member";
import { ApiListResponse } from "@/types/api";

export interface ClubListQuery {
  page?: number;
  pageSize?: number;
  sort?: { field: string; direction?: "asc" | "desc" };
}

export const clubProvider = {
  async listClubs(query: ClubListQuery = {}): Promise<ApiListResponse<Club>> {
    const { page = 1, pageSize = 20, sort } = query;
    const params = new URLSearchParams();
    params.set("page", String(Math.max(0, page - 1)));
    params.set("size", String(pageSize));
    if (sort?.field) {
      params.set(
        "sort",
        sort.direction === "desc" ? `${sort.field},desc` : sort.field
      );
    }

    const res = await apiProvider.call<Response>({
      url: `clubs?${params.toString()}`,
      method: "GET",
      raw: true,
    });
    const data: Club[] = await (res as any).json();
    const totalHeader = (res as any).headers.get("X-Total-Count");
    const total = totalHeader ? parseInt(totalHeader, 10) : data.length;

    return {
      data,
      total,
      page,
      pageSize,
    };
  },

  async getClub(id: number): Promise<Club> {
    return apiProvider.call<Club>({ url: `clubs/${id}`, method: "GET" });
  },

  async createClub(payload: Partial<Club>): Promise<Club> {
    return apiProvider.call<Club>({
      url: "clubs",
      method: "POST",
      body: payload,
    });
  },

  async updateClub(id: number, payload: Partial<Club>): Promise<Club> {
    return apiProvider.call<Club>({
      url: `clubs/${id}`,
      method: "PUT",
      body: payload,
    });
  },

  async deleteClub(id: number): Promise<void> {
    await apiProvider.call<void>({ url: `clubs/${id}`, method: "DELETE" });
  },
};
