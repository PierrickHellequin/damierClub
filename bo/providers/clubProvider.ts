import { apiProvider } from "./apiProvider";
import { Club, Member } from "@/types/member";
import { ClubStats } from "@/types/clubStats";
import { ApiListResponse } from "@/types/api";

export interface ClubListQuery {
  page?: number;
  pageSize?: number;
  sort?: { field: string; direction?: "asc" | "desc" };
  search?: string;
  city?: string;
}

export const clubProvider = {
  async listClubs(query: ClubListQuery = {}): Promise<ApiListResponse<Club>> {
    const { page = 1, pageSize = 20, sort, search, city } = query;
    const params = new URLSearchParams();
    params.set("page", String(Math.max(0, page - 1)));
    params.set("size", String(pageSize));
    if (sort?.field) {
      params.set(
        "sort",
        sort.direction === "desc" ? `${sort.field},desc` : sort.field
      );
    }
    if (search) params.set("search", search);
    if (city) params.set("city", city);

    const res = await apiProvider.call<Response>({
      url: `clubs?${params.toString()}`,
      method: "GET",
      raw: true,
    });
    const data: Club[] = await (res as any).json();
    console.log("📊 Clubs data received:", data);
    const totalHeader = (res as any).headers.get("X-Total-Count");
    const total = totalHeader ? parseInt(totalHeader, 10) : data.length;
    console.log("📊 Total clubs:", total);

    return {
      data,
      total,
      page,
      pageSize,
    };
  },

  async getClub(id: string): Promise<Club> {
    return apiProvider.call<Club>({ url: `clubs/${id}`, method: "GET" });
  },

  async createClub(payload: Partial<Club>): Promise<Club> {
    return apiProvider.call<Club>({
      url: "clubs",
      method: "POST",
      body: payload,
    });
  },

  async updateClub(id: string, payload: Partial<Club>): Promise<Club> {
    return apiProvider.call<Club>({
      url: `clubs/${id}`,
      method: "PUT",
      body: payload,
    });
  },

  async deleteClub(id: string): Promise<void> {
    await apiProvider.call<void>({ url: `clubs/${id}`, method: "DELETE" });
  },

  async getClubStats(id: string): Promise<ClubStats> {
    return apiProvider.call<ClubStats>({ url: `clubs/${id}/stats`, method: "GET" });
  },

  async getClubMembers(id: string): Promise<Member[]> {
    return apiProvider.call<Member[]>({ url: `clubs/${id}/members`, method: "GET" });
  },
};
