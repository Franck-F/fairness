# Template d'analyse des résultats

À remplir **après** la collecte de toutes les sessions. Ce template est conçu pour être directement copié-collé (ou synthétisé) dans la section 4.3 du mémoire.

## 1. Échantillon réalisé

| Testeur | Fonction | Secteur | Taille entreprise | Niveau numérique | Ordre tâches |
|---------|----------|---------|-------------------|------------------|--------------|
| T01 | | | | / 5 | |
| T02 | | | | / 5 | |
| T03 | | | | / 5 | |
| T04 | | | | / 5 | |
| T05 | | | | / 5 | |
| T06 | | | | / 5 | |
| T07 | | | | / 5 | |
| T08 | | | | / 5 | |

**N total** : ___   **Âge moyen** : ___   **Répartition F/H** : ___

## 2. Scores SUS

| Testeur | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Score SUS /100 |
|---------|----|----|----|----|----|----|----|----|----|-----|----------------|
| T01 | | | | | | | | | | | |
| T02 | | | | | | | | | | | |
| T03 | | | | | | | | | | | |
| T04 | | | | | | | | | | | |
| T05 | | | | | | | | | | | |
| T06 | | | | | | | | | | | |
| T07 | | | | | | | | | | | |
| T08 | | | | | | | | | | | |

**Moyenne** : ___   **Médiane** : ___   **Écart-type** : ___   **Min** : ___   **Max** : ___

**Interprétation (H2 : SUS > 70)** :
- [ ] Validée
- [ ] Non validée
- [ ] Tendance (préciser)

## 3. Time-on-task par condition

Valeurs en secondes.

| Testeur | T1 AuditIQ | T2 Fairlearn | T3 LLM-audit |
|---------|------------|--------------|--------------|
| T01 | | | |
| T02 | | | |
| T03 | | | |
| T04 | | | |
| T05 | | | |
| T06 | | | |
| T07 | | | |
| T08 | | | |
| **Médiane** | | | |
| **Moyenne** | | | |
| **Écart-type** | | | |

**Test de Wilcoxon apparié T1 vs T2** : W = ___ , p = ___

**Interprétation (H1 : T1 médian < 600 s)** :
- [ ] Validée
- [ ] Non validée

## 4. Taux de complétion

| Tâche | Complétées | Total | Taux (%) |
|-------|------------|-------|----------|
| T1 | / | | |
| T2 | / | | |
| T3 | / | | |
| **Global** | / | | |

**Interprétation (H4 : ≥ 80 %)** :
- [ ] Validée
- [ ] Non validée

## 5. Erreurs et demandes d'aide

| Testeur | Erreurs T1 | Aides T1 | Erreurs T2 | Aides T2 | Erreurs T3 | Aides T3 |
|---------|------------|----------|------------|----------|------------|----------|
| T01 | | | | | | |
| T02 | | | | | | |
| T03 | | | | | | |
| T04 | | | | | | |
| T05 | | | | | | |
| T06 | | | | | | |
| T07 | | | | | | |
| T08 | | | | | | |
| **Moyenne** | | | | | | |

## 6. Confiance pré/post (H3)

| Testeur | Confiance pré (Q17) | Confiance post (P1) | Delta |
|---------|---------------------|---------------------|-------|
| T01 | | | |
| T02 | | | |
| T03 | | | |
| T04 | | | |
| T05 | | | |
| T06 | | | |
| T07 | | | |
| T08 | | | |

**Delta moyen** : ___   **Test de Wilcoxon apparié** : W = ___, p = ___

**Interprétation (H3 : delta > 0, p < 0,05)** :
- [ ] Validée
- [ ] Non validée

## 7. Intention d'usage et NPS

| Testeur | P3 Usage (1-5) | P4 AI Act (1-5) | P6 NPS (0-10) |
|---------|----------------|------------------|----------------|
| T01 | | | |
| T02 | | | |
| T03 | | | |
| T04 | | | |
| T05 | | | |
| T06 | | | |
| T07 | | | |
| T08 | | | |

- **Moyenne P3** : ___
- **% Promoteurs (9-10)** : ___
- **% Détracteurs (0-6)** : ___
- **NPS indicatif** : ___

## 8. Corrélation niveau numérique / SUS

Spearman ρ = ___ , p = ___

**Lecture** : ________________________________________________

## 9. Analyse thématique des verbatims (Braun & Clarke, 2006)

### Thème 1 — [nom du thème]

**Fréquence** : cité par __ / __ testeurs

**Verbatims représentatifs** :
- T0X : « ... »
- T0Y : « ... »

**Interprétation** : ____________________________________________

### Thème 2 — [nom]

**Fréquence** : __ / __

**Verbatims** :
- ...

### Thème 3 — [nom]

...

### Thèmes additionnels

...

## 10. Points de friction les plus récurrents

| # | Friction | Tâche | Nb de testeurs | Gravité (1-3) |
|---|----------|-------|----------------|---------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

## 11. Synthèse des hypothèses

| Hypothèse | Résultat | Preuve |
|-----------|----------|--------|
| H1 — T1 < 10 min | [ ] Validée [ ] Non | |
| H2 — SUS > 70 | [ ] Validée [ ] Non | |
| H3 — Δ confiance > 0 significatif | [ ] Validée [ ] Non | |
| H4 — Complétion ≥ 80 % | [ ] Validée [ ] Non | |

## 12. Implications pour la version finale du MVP

**À corriger en priorité** (avant soutenance) :
1. ____________________________________________________________
2. ____________________________________________________________
3. ____________________________________________________________

**À améliorer dans la V2** :
1. ____________________________________________________________
2. ____________________________________________________________

**Hypothèses à explorer lors d'un futur test** :
1. ____________________________________________________________
2. ____________________________________________________________

## 13. Limites de l'étude

- Taille d'échantillon réduite (N = __).
- Recrutement par convenance, biais de sélection possible.
- Sessions conduites par le concepteur lui-même — risque de biais d'animation (mitigé par script fixe et absence pendant les questionnaires).
- Durée d'observation courte, pas d'étude longitudinale.
- Absence de groupe contrôle (tous les testeurs utilisent AuditIQ).

## 14. Conclusion (3-5 phrases)

____________________________________________________________
____________________________________________________________
____________________________________________________________
