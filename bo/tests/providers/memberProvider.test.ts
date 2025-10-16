import { describe, it, expect, vi, beforeEach } from 'vitest'
import { memberProvider } from '@/providers/memberProvider'
import { apiProvider } from '@/providers/apiProvider'
import type { Member } from '@/types/member'

// Mock du apiProvider
vi.mock('@/providers/apiProvider', () => ({
  apiProvider: {
    call: vi.fn(),
  },
}))

describe('MemberProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMember', () => {
    it('should accept UUID string as parameter', async () => {
      const mockMember: Member = {
        id: '0199ee89-af5f-76df-9bfc-d343d49f1d38',
        name: 'Test User',
        email: 'test@example.com',
      }

      vi.mocked(apiProvider.call).mockResolvedValueOnce(mockMember)

      const result = await memberProvider.getMember('0199ee89-af5f-76df-9bfc-d343d49f1d38')

      expect(apiProvider.call).toHaveBeenCalledWith({
        url: 'members/0199ee89-af5f-76df-9bfc-d343d49f1d38',
        method: 'GET',
      })
      expect(result).toEqual(mockMember)
    })

    it('should NOT accept number as parameter', () => {
      // @ts-expect-error - getMember attend string, pas number
      const invalidCall = memberProvider.getMember(123)

      // Ce test compile avec erreur TS, prouvant que le type est correct
      expect(invalidCall).toBeDefined()
    })

    it('should build correct URL with full UUID', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000'
      vi.mocked(apiProvider.call).mockResolvedValueOnce({} as Member)

      await memberProvider.getMember(uuid)

      expect(apiProvider.call).toHaveBeenCalledWith({
        url: `members/${uuid}`,
        method: 'GET',
      })
    })
  })

  describe('updateMember', () => {
    it('should accept UUID string as id parameter', async () => {
      const uuid = '0199ee89-af5f-76df-9bfc-d343d49f1d38'
      const updates = { name: 'Updated Name' }
      const mockMember: Member = {
        id: uuid,
        name: 'Updated Name',
        email: 'test@example.com',
      }

      vi.mocked(apiProvider.call).mockResolvedValueOnce(mockMember)

      const result = await memberProvider.updateMember(uuid, updates)

      expect(apiProvider.call).toHaveBeenCalledWith({
        url: `members/${uuid}`,
        method: 'PUT',
        body: updates,
      })
      expect(result.id).toBe(uuid)
    })
  })

  describe('deleteMember', () => {
    it('should accept UUID string as parameter', async () => {
      const uuid = '0199ee89-af5f-76df-9bfc-d343d49f1d38'
      vi.mocked(apiProvider.call).mockResolvedValueOnce(undefined)

      await memberProvider.deleteMember(uuid)

      expect(apiProvider.call).toHaveBeenCalledWith({
        url: `members/${uuid}`,
        method: 'DELETE',
      })
    })
  })

  describe('listMembers', () => {
    it('should return list with UUID strings in items', async () => {
      const mockMembers: Member[] = [
        { id: '0199ee89-af5f-76df-9bfc-d343d49f1d38', name: 'User 1', email: 'user1@test.com' },
        { id: '0199ee89-af5f-76df-9bfc-d343d49f1d39', name: 'User 2', email: 'user2@test.com' },
      ]

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockMembers),
        headers: {
          get: vi.fn().mockReturnValue('2'),
        },
      }

      vi.mocked(apiProvider.call).mockResolvedValueOnce(mockResponse as any)

      const result = await memberProvider.listMembers({ page: 1, pageSize: 20 })

      expect(result.data).toHaveLength(2)
      expect(typeof result.data[0].id).toBe('string')
      expect(typeof result.data[1].id).toBe('string')
      expect(result.total).toBe(2)
    })
  })
})
