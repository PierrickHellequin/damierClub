import { apiProvider } from "./apiProvider";
import { Member } from "@/types/member";
import { ApiListResponse } from "@/types/api";
import { OrderParamsType, buildOrderParams } from "./providerHelper";

export interface MemberListQuery {
  page?: number; // 1-based côté front
  pageSize?: number; // taille de page
  sort?: OrderParamsType; // { field, direction }
  active?: boolean; // filtre actif
  clubId?: number; // filtre par club
  clubRole?: string; // filtre par rôle dans le club
}

function buildListUrl({
  page = 1,
  pageSize = 20,
  sort,
  active,
  clubId,
  clubRole,
}: MemberListQuery) {
  const params = new URLSearchParams();
  // backend attend page 0-based
  params.set("page", String(Math.max(0, page - 1)));
  params.set("size", String(pageSize));
  if (sort?.field) {
    params.set(
      "sort",
      sort.direction && sort.direction.toLowerCase() === "desc"
        ? `${sort.field},desc`
        : sort.field
    );
  }
  if (typeof active === "boolean") params.set("active", String(active));
  if (clubId) params.set("clubId", String(clubId));
  if (clubRole) params.set("clubRole", clubRole);
  return `members?${params.toString()}`;
}

export const memberProvider = {
  async listMembers(
    query: MemberListQuery = {}
  ): Promise<ApiListResponse<Member>> {
    const url = buildListUrl(query);
    try {
      // Besoin des headers -> raw
      const res = await apiProvider.call<Response>({
        url,
        method: "GET",
        raw: true,
      });
      const data: Member[] = await (res as any).json();
      const totalHeader = (res as any).headers.get("X-Total-Count");
      const total = totalHeader ? parseInt(totalHeader, 10) : data.length;
      const result = {
        data,
        total,
        page: query.page || 1,
        pageSize: query.pageSize || 20,
      };
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getMember(id: string): Promise<Member> {
    return apiProvider.call<Member>({ url: `members/${id}`, method: "GET" });
  },

  async createMember(
    payload: Partial<Member> & { password?: string }
  ): Promise<Member> {
    return apiProvider.call<Member>({
      url: "members",
      method: "POST",
      body: payload,
    });
  },

  async updateMember(
    id: string,
    payload: Partial<Member> & { password?: string }
  ): Promise<Member> {
    return apiProvider.call<Member>({
      url: `members/${id}`,
      method: "PUT",
      body: payload,
    });
  },

  async deleteMember(id: string): Promise<void> {
    await apiProvider.call<void>({ url: `members/${id}`, method: "DELETE" });
  },

  // Nouvelle méthode pour obtenir les membres d'un club avec leurs rôles
  async getMembersByClub(
    clubId: number,
    query: Omit<MemberListQuery, "clubId"> = {}
  ): Promise<ApiListResponse<Member>> {
    return this.listMembers({ ...query, clubId });
  },

  // Nouvelle méthode pour obtenir les membres par rôle
  async getMembersByRole(
    clubRole: string,
    query: Omit<MemberListQuery, "clubRole"> = {}
  ): Promise<ApiListResponse<Member>> {
    return this.listMembers({ ...query, clubRole });
  },
};
