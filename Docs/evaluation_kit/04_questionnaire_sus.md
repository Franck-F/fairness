# Questionnaire SUS — System Usability Scale

Version française standard (traduction consolidée par l'auteur à partir de la formulation originale de Brooke, 1996). À administrer **immédiatement après** la dernière tâche, avant le questionnaire post-test.

## Consigne à lire au testeur

> « Voici 10 courtes affirmations sur l'outil que vous venez d'utiliser. Pour chacune, indiquez spontanément votre niveau d'accord, de 1 (pas du tout d'accord) à 5 (tout à fait d'accord). Ne réfléchissez pas trop longtemps. Si vous hésitez, choisissez 3. Répondez en pensant à AuditIQ. »

## Échelle

1 = Pas du tout d'accord · 2 = Plutôt pas d'accord · 3 = Neutre · 4 = Plutôt d'accord · 5 = Tout à fait d'accord

## Les 10 items

| # | Affirmation | 1 | 2 | 3 | 4 | 5 |
|---|-------------|---|---|---|---|---|
| Q1 | Je pense que j'aimerais utiliser AuditIQ fréquemment | | | | | |
| Q2 | J'ai trouvé AuditIQ inutilement complexe | | | | | |
| Q3 | J'ai trouvé AuditIQ facile à utiliser | | | | | |
| Q4 | Je pense que j'aurais besoin du soutien d'un expert pour être capable d'utiliser AuditIQ | | | | | |
| Q5 | J'ai trouvé que les différentes fonctionnalités d'AuditIQ étaient bien intégrées | | | | | |
| Q6 | J'ai trouvé qu'il y avait trop d'incohérences dans AuditIQ | | | | | |
| Q7 | J'imagine que la plupart des gens apprendraient à utiliser AuditIQ très rapidement | | | | | |
| Q8 | J'ai trouvé AuditIQ très lourd à utiliser | | | | | |
| Q9 | Je me suis senti(e) en confiance en utilisant AuditIQ | | | | | |
| Q10 | J'ai eu besoin d'apprendre beaucoup de choses avant de pouvoir me servir d'AuditIQ | | | | | |

## Calcul du score SUS

Le score SUS est un nombre sur 100 (ce n'est **pas** un pourcentage). Formule officielle de Brooke (1996) :

1. Pour les items **impairs** (Q1, Q3, Q5, Q7, Q9) : contribution = (réponse − 1).
2. Pour les items **pairs** (Q2, Q4, Q6, Q8, Q10) : contribution = (5 − réponse).
3. Additionner les 10 contributions : somme comprise entre 0 et 40.
4. Multiplier la somme par **2,5** : score final sur 100.

Formule condensée :

```
SUS = 2.5 × [ (Q1 + Q3 + Q5 + Q7 + Q9 − 5) + (25 − Q2 − Q4 − Q6 − Q8 − Q10) ]
```

### Exemple

Réponses : Q1=4, Q2=2, Q3=4, Q4=2, Q5=4, Q6=1, Q7=5, Q8=2, Q9=4, Q10=2

- Impairs : (4-1) + (4-1) + (4-1) + (5-1) + (4-1) = 3+3+3+4+3 = 16
- Pairs : (5-2) + (5-2) + (5-1) + (5-2) + (5-2) = 3+3+4+3+3 = 16
- Somme = 32
- SUS = 32 × 2,5 = **80**

## Interprétation

| Score | Lecture |
|-------|---------|
| < 50 | Inacceptable / mauvais |
| 50 – 70 | Correct, améliorations nécessaires |
| > 70 | Bon (seuil de validation de H2) |
| > 85 | Excellent |
| > 90 | Exceptionnel |

Repères complémentaires issus de Bangor, Kortum & Miller (2008) :
- moyenne industrielle observée ≈ 68 ;
- score ≥ 80,3 correspond au quartile supérieur (« grade A ») ;
- score ≤ 51 correspond au quartile inférieur (« grade F »).

## Source

Brooke, J. (1996). SUS — A quick and dirty usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability Evaluation in Industry* (pp. 189-194). Taylor & Francis.

Bangor, A., Kortum, P., & Miller, J. (2008). An empirical evaluation of the System Usability Scale. *International Journal of Human-Computer Interaction*, 24(6), 574-594.
