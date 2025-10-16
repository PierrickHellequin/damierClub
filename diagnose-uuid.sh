#!/bin/bash
set -e

echo "🔍 DIAGNOSTIC UUID - DamierClub"
echo "================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_BASE="http://localhost:8090"

echo "1️⃣  Test: Connexion avec compte existant..."
RESPONSE=$(curl -s "$API_BASE/api/internal/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"pkhv@hotmail.fr","password":"123456"}')

USER_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
USER_EMAIL=$(echo $RESPONSE | grep -o '"email":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
  echo -e "${RED}❌ ÉCHEC: Impossible de se connecter${NC}"
  echo "Réponse: $RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Connecté${NC}"
echo "   UUID: $USER_ID"
echo "   Email: $USER_EMAIL"
echo ""

echo "2️⃣  Test: UUID est au bon format..."
if [[ $USER_ID =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
  echo -e "${GREEN}✅ UUID valide${NC}"
else
  echo -e "${RED}❌ ÉCHEC: UUID invalide: $USER_ID${NC}"
  exit 1
fi
echo ""

echo "3️⃣  Test: Accès au profil avec UUID complet..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/members/$USER_ID" \
  -H "X-User-Email: $USER_EMAIL")

if [ "$STATUS" = "200" ]; then
  echo -e "${GREEN}✅ API accepte l'UUID complet (Status: 200)${NC}"
else
  echo -e "${RED}❌ ÉCHEC: API retourne $STATUS au lieu de 200${NC}"
  echo -e "${RED}   Cela signifie que l'UUID est peut-être tronqué${NC}"
  exit 1
fi
echo ""

echo "4️⃣  Test: API rejette les IDs numériques..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/members/123" \
  -H "X-User-Email: $USER_EMAIL")

if [ "$STATUS" -ge "400" ]; then
  echo -e "${GREEN}✅ API rejette correctement les nombres (Status: $STATUS)${NC}"
else
  echo -e "${YELLOW}⚠️  API accepte les nombres (Status: $STATUS) - Cela peut causer des problèmes${NC}"
fi
echo ""

echo "5️⃣  Test: Vérification des fichiers source frontend..."

# Vérifier que Member.id est bien string
if grep -q "id: string" bo/types/member.ts 2>/dev/null; then
  echo -e "${GREEN}✅ types/member.ts: Member.id est string${NC}"
else
  echo -e "${RED}❌ types/member.ts: Member.id n'est PAS string!${NC}"
  exit 1
fi

# Vérifier qu'il n'y a pas de parseInt dans la page profil
if grep -q "parseInt" bo/app/profil/\\[id\\]/page.tsx 2>/dev/null; then
  echo -e "${RED}❌ profil/page.tsx: parseInt() détecté - UUID sera tronqué!${NC}"
  exit 1
else
  echo -e "${GREEN}✅ profil/page.tsx: Pas de parseInt()${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}🎉 TOUS LES TESTS PASSENT!${NC}"
echo ""
echo "Pour tester dans le navigateur:"
echo "  1. Allez sur: http://localhost:3009/login"
echo "  2. Connectez-vous avec: pkhv@hotmail.fr / 123456"
echo "  3. Accédez à: http://localhost:3009/profil/$USER_ID"
echo ""
echo "Dans la console navigateur, vous devriez voir:"
echo -e "  ${GREEN}GET http://localhost:8090/api/members/$USER_ID${NC}"
echo ""
echo -e "${YELLOW}Si vous voyez encore '/api/members/199', faites:${NC}"
echo "  - CTRL + SHIFT + R (force reload)"
echo "  - Ou: docker restart club-bo"
