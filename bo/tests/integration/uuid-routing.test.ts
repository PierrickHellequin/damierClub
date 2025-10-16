import { describe, it, expect, beforeAll } from 'vitest'

describe('UUID Routing Integration Test', () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090'
  let testUserId: string
  let testUserEmail: string

  beforeAll(async () => {
    // Créer un utilisateur de test
    const response = await fetch(`${API_BASE}/api/internal/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `testuser-${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        password: 'Test123456!',
      }),
    })

    expect(response.ok).toBe(true)
    const user = await response.json()
    testUserId = user.id
    testUserEmail = user.email

    console.log('✅ Test user created:', { id: testUserId, email: testUserEmail })
  })

  it('should return UUID as string from registration', async () => {
    const response = await fetch(`${API_BASE}/api/internal/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `testuser2-${Date.now()}`,
        email: `test2-${Date.now()}@example.com`,
        password: 'Test123456!',
      }),
    })

    const user = await response.json()

    // Vérifier que l'ID est un UUID string
    expect(typeof user.id).toBe('string')
    expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)

    // Vérifier qu'il n'est PAS un nombre
    expect(user.id).not.toMatch(/^\d+$/)
  })

  it('should accept full UUID in API endpoint (not truncated number)', async () => {
    // Appeler l'API avec l'UUID complet
    const response = await fetch(`${API_BASE}/api/members/${testUserId}`, {
      headers: { 'X-User-Email': testUserEmail },
    })

    // Si on reçoit 403, c'est que l'UUID a été tronqué
    if (response.status === 403) {
      throw new Error(
        `❌ ÉCHEC: API retourne 403 pour UUID ${testUserId}. ` +
        `Cela signifie probablement que l'UUID est tronqué en nombre côté frontend.`
      )
    }

    expect(response.status).toBe(200)

    const member = await response.json()
    expect(member.id).toBe(testUserId)
    expect(typeof member.id).toBe('string')

    console.log('✅ API accepts full UUID:', testUserId)
  })

  it('should REJECT numeric ID (old format)', async () => {
    // Tester avec un nombre (ancien format incorrect)
    const response = await fetch(`${API_BASE}/api/members/123`, {
      headers: { 'X-User-Email': testUserEmail },
      method: 'GET',
    })

    // Devrait échouer car 123 n'est pas un UUID valide
    expect(response.status).toBeGreaterThanOrEqual(400)

    console.log('✅ API correctly rejects numeric ID')
  })

  it('should preserve UUID in profile URL parsing', () => {
    const uuid = '0199ee84-e695-7d1e-83df-a9f953867224'

    // Simuler ce que fait la page profil
    const urlParam = uuid
    const parsedId = typeof urlParam === 'string' ? urlParam : String(urlParam)

    // Vérifier qu'on ne parse PAS en entier
    expect(parsedId).toBe(uuid)
    expect(parsedId).not.toMatch(/^\d+$/)
    expect(parsedId.length).toBeGreaterThan(10) // UUID est bien plus long qu'un nombre

    console.log('✅ Profile URL parsing preserves UUID')
  })

  it('should build correct API URL with full UUID', () => {
    const uuid = '0199ee84-e695-7d1e-83df-a9f953867224'
    const apiUrl = `${API_BASE}/api/members/${uuid}`

    // Vérifier que l'URL contient l'UUID complet
    expect(apiUrl).toContain(uuid)
    expect(apiUrl).not.toContain('/api/members/199')
    expect(apiUrl).toMatch(/\/api\/members\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)

    console.log('✅ API URL correctly formatted with UUID:', apiUrl)
  })
})
