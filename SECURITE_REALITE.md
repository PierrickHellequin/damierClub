# Sécurité - La Réalité

## ⚠️ Constat : Les Server Actions ne résolvent pas le problème

### Ce que j'ai découvert

Après implémentation, **les Server Actions Next.js n'empêchent PAS l'exposition des credentials dans le réseau**. Dans l'onglet Network, on voit toujours :

```
Payload: ["pkhv@hotmail.fr", "123456"]
```

**Pourquoi ?** Les Server Actions transmettent les paramètres de fonction comme payload de la requête. Le navigateur voit toujours les données.

## ✅ La VRAIE solution

### Problème fondamental

**Le mot de passe ne devrait JAMAIS être stocké ou transmis en clair**, que ce soit :
- Dans le réseau (Network tab)
- Dans localStorage
- Dans des cookies
- Dans la base de données

### Solution recommandée : JWT + Hash

```
┌─────────────┐                ┌──────────────┐                ┌──────────────┐
│   Client    │                │  Backend API │                │  PostgreSQL  │
│  (Browser)  │                │ (Spring Boot)│                │              │
└──────┬──────┘                └──────┬───────┘                └──────┬───────┘
       │                              │                               │
       │ 1. POST /login               │                               │
       │    { email, password }       │                               │
       ├─────────────────────────────>│                               │
       │                              │                               │
       │                              │ 2. Hash password (BCrypt)     │
       │                              │    SELECT * FROM users        │
       │                              │    WHERE email = ?            │
       │                              ├──────────────────────────────>│
       │                              │                               │
       │                              │<──────────────────────────────┤
       │                              │ 3. User found                 │
       │                              │                               │
       │                              │ 4. Compare hash               │
       │                              │    BCrypt.compare()           │
       │                              │                               │
       │ 5. JWT Token                 │                               │
       │    { token: "eyJ..." }       │                               │
       │<─────────────────────────────┤                               │
       │                              │                               │
       │ 6. Store token in            │                               │
       │    httpOnly cookie           │                               │
       │                              │                               │
```

## 🔐 Checklist de sécurité COMPLÈTE

### Backend (Spring Boot) ✅ À FAIRE

- [ ] **Hasher les mots de passe** avec BCrypt (jamais en clair en DB)
- [ ] **Générer des JWT tokens** après login réussi
- [ ] **Valider les JWT** sur chaque requête API
- [ ] **Implémenter le refresh token** pour les sessions longues
- [ ] **HTTPS obligatoire** en production
- [ ] **Rate limiting** sur `/login` (max 5 tentatives/min)
- [ ] **CORS** configuré correctement

### Frontend (Next.js) ✅ ACTUEL

- [x] Transmettre le mot de passe via POST (pas GET/query params)
- [x] Utiliser des cookies HTTP-only pour le token
- [ ] Ne JAMAIS stocker le mot de passe (même en localStorage)
- [ ] Implémenter la rotation des tokens
- [ ] Gérer l'expiration des sessions

## 📋 Plan d'action recommandé

### Phase 1 : Backend Security (PRIORITÉ 1)

```java
// 1. Dans SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// 2. Dans MemberService.java - À l'inscription
public Member register(RegisterRequest request) {
    Member member = new Member();
    member.setEmail(request.getEmail());
    // HASH le mot de passe avant sauvegarde
    member.setPassword(passwordEncoder.encode(request.getPassword()));
    return memberRepository.save(member);
}

// 3. Dans AuthController.java - Login
public LoginResponse login(LoginRequest request) {
    Member member = memberRepository.findByEmail(request.getEmail());

    // Vérifier le hash
    if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
        throw new UnauthorizedException();
    }

    // Générer JWT
    String token = jwtService.generateToken(member);
    return new LoginResponse(token, member);
}
```

### Phase 2 : JWT Implementation

```java
// JwtService.java
public String generateToken(Member member) {
    return Jwts.builder()
        .setSubject(member.getEmail())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
        .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
        .compact();
}

public boolean validateToken(String token) {
    try {
        Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
        return true;
    } catch (JwtException e) {
        return false;
    }
}
```

### Phase 3 : Frontend Token Management

```typescript
// AuthProvider.tsx
async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/internal/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important pour les cookies
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  // Le backend a déjà set le cookie HTTP-only avec le JWT
  // On stocke juste les infos user (PAS le token)
  persist(data.user);
  return data.user;
}
```

## 🚫 Ce qui NE fonctionne PAS

1. ❌ **Server Actions** : Les params sont visibles dans Network
2. ❌ **localStorage pour le password** : Vulnérable aux XSS
3. ❌ **Mots de passe en clair en DB** : Catastrophique si leak
4. ❌ **Header X-User-Email sans validation** : Facile à forger

## ✅ Ce qui FONCTIONNE

1. ✅ **BCrypt** : Hash irréversible des mots de passe
2. ✅ **JWT tokens** : Sessions sécurisées et stateless
3. ✅ **HTTP-only cookies** : Protection XSS automatique
4. ✅ **HTTPS** : Chiffrement de bout en bout
5. ✅ **Rate limiting** : Protection brute-force

## 📊 Comparaison

| Méthode | Mot de passe visible | Token sécurisé | Protection XSS | Production Ready |
|---------|---------------------|----------------|----------------|------------------|
| **Actuel** | ⚠️ Oui | ❌ Non | ❌ Non | ❌ Non |
| **Server Actions** | ⚠️ Oui | ❌ Non | ⚠️ Partiel | ❌ Non |
| **JWT + BCrypt** | ❌ Non | ✅ Oui | ✅ Oui | ✅ Oui |

## 🎯 Recommandation finale

**Abandonner l'approche Server Actions** et implémenter :

1. **BCrypt** dans le backend pour hasher les passwords
2. **JWT** pour les sessions
3. **HTTP-only cookies** pour stocker le JWT
4. **HTTPS** en production

Cette approche est :
- ✅ Standard de l'industrie
- ✅ Éprouvée et sécurisée
- ✅ Compatible avec tous les navigateurs
- ✅ Scalable

---

**Conclusion** : Les Server Actions ne résolvent pas le problème fondamental. La sécurité doit être implémentée **côté backend** avec BCrypt + JWT.
