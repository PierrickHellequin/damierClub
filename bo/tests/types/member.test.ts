import { describe, it, expect } from 'vitest'
import type { Member, Club } from '@/types/member'

describe('Member Type', () => {
  it('should have id as string (UUID)', () => {
    const member: Member = {
      id: '0199ee89-af5f-76df-9bfc-d343d49f1d38',
      name: 'Test User',
      email: 'test@example.com',
    }

    expect(typeof member.id).toBe('string')
    expect(member.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })

  it('should reject numeric id at compile time (TypeScript)', () => {
    // Ce test vérifie que TypeScript empêche l'utilisation de number pour id
    // Le @ts-expect-error prouve que TypeScript rejette le type number
    // @ts-expect-error - id doit être string, pas number
    const invalidMember: Member = {
      id: 123,
      name: 'Test User',
      email: 'test@example.com',
    }

    // Au runtime, JavaScript permet toujours number, donc on vérifie juste la présence
    // Le vrai test est que TypeScript génère une erreur (ligne @ts-expect-error)
    expect(invalidMember).toBeDefined()
  })

  it('should accept valid UUID formats', () => {
    const validUUIDs = [
      '0199ee89-af5f-76df-9bfc-d343d49f1d38',
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    ]

    validUUIDs.forEach(uuid => {
      const member: Member = {
        id: uuid,
        name: 'Test',
        email: 'test@test.com',
      }
      expect(member.id).toBe(uuid)
    })
  })

  it('should have optional club relation', () => {
    const memberWithClub: Member = {
      id: '0199ee89-af5f-76df-9bfc-d343d49f1d38',
      name: 'Test',
      email: 'test@test.com',
      club: { id: 1 },
      clubId: 1,
      clubName: 'Test Club',
    }

    expect(memberWithClub.club).toBeDefined()
    expect(memberWithClub.clubId).toBe(1)
    expect(memberWithClub.clubName).toBe('Test Club')
  })
})

describe('Club Type', () => {
  it('should have id as number', () => {
    const club: Club = {
      id: 1,
      name: 'Test Club',
    }

    expect(typeof club.id).toBe('number')
  })
})
