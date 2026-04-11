# Kit de défense pour la soutenance

Document interne — non destiné au jury. Anticipation des attaques probables et
formulation de réponses pré-éprouvées pour les 15 minutes de Q&A.

---

## 1. Le pitch en 60 secondes (à mémoriser)

> Mon mémoire part d'un constat simple : 38 % des PME que j'ai interrogées ne
> savent pas ce qu'est un biais algorithmique, mais 44 % soupçonnent que leurs
> outils IA peuvent discriminer. Et l'AI Act européen, entré en application
> pour les systèmes à haut risque, leur impose désormais de détecter ces biais.
> Le problème : les outils existants — Fairlearn, AIF360 — sont des frameworks
> Python pour data scientists. Inutilisables pour une PME de vingt salariés
> sans expert.
>
> J'ai conçu et développé AuditIQ, une plateforme SaaS qui rend l'audit de
> fairness accessible à un non-spécialiste. Trois modules complémentaires :
> un audit supervisé classique pour les PME qui ont des données labellisées,
> une détection non supervisée par clustering pour celles qui n'en ont pas
> — c'est essentiel parce que l'article 10(5) de l'AI Act pose un dilemme RGPD
> sur la collecte d'attributs sensibles —, et un audit de chatbot inspiré de
> LangBiTe pour les 17 % de PME de mon panel qui utilisent des assistants
> conversationnels.
>
> Ma contribution théorique principale, c'est le concept de **triple
> interface** — cognitive, technique, réglementaire — comme grille de lecture
> du fossé entre les outils existants et les besoins réels des PME françaises.
> AuditIQ n'est pas un certificat de conformité, c'est un point d'entrée
> documenté dans une démarche de gouvernance IA.

---

## 2. Les 12 questions du jury que tu DOIS savoir traiter

### Q1. « Votre outil fait-il vraiment que la PME se conforme à l'AI Act ? »

**Piège** : confondre détection de biais et conformité globale.

**Réponse honnête** :
> Non, et le mémoire le précise explicitement. AuditIQ adresse les articles 10
> (gouvernance des données et examen des biais) et 11 (documentation
> technique) — c'est environ 15 % des obligations totales de l'AI Act pour un
> système haut risque. Les articles 9 (gestion des risques organisationnelle),
> 14 (supervision humaine), 17 (système de management qualité), 43
> (évaluation de conformité par tiers) et 49 (enregistrement EU database)
> exigent une démarche juridique et organisationnelle qu'un outil seul ne
> peut pas couvrir. AuditIQ est positionné comme la première brique d'une
> démarche, pas comme la démarche complète. Cette honnêteté est la condition
> de crédibilité de l'outil.

### Q2. « Comment une PME obtient-elle le CSV avec ground truth et attribut sensible ? »

**Piège** : c'est LE point faible des outils de fairness existants.

**Réponse** :
> C'est exactement la question qui m'a poussé à ajouter le module de
> détection non supervisée. Sur le mode supervisé classique, oui, l'utilisateur
> doit fournir prédictions, vérité terrain et attribut sensible — et c'est un
> obstacle réel pour beaucoup de PME. C'est pourquoi le module 2 d'AuditIQ
> permet de détecter des disparités de traitement par clustering, sans avoir
> besoin de labels démographiques. L'approche est inspirée d'Algorithm Audit,
> reconnue par l'OCDE dans son Catalogue of Tools for Trustworthy AI. Elle
> contourne le paradoxe de l'article 10(5) AI Act / RGPD sur la collecte de
> données sensibles. C'est une réponse partielle — un cluster non supervisé
> n'a pas la précision d'un attribut labellisé — mais c'est exploitable
> immédiatement par une PME qui n'a aucune base démographique.

### Q3. « Pourquoi un outil pour PME alors que les frameworks open source sont gratuits ? »

**Réponse** :
> Parce que la gratuité technique ne suffit pas si la barrière cognitive est
> infranchissable. Fairlearn est gratuit mais suppose Python, scikit-learn,
> la compréhension de Demographic Parity vs Equal Opportunity, et la capacité
> à interpréter les résultats face aux exigences réglementaires. C'est ce que
> j'appelle dans le mémoire la triple interface : cognitive — comprendre ce
> qu'est un biais —, technique — savoir l'évaluer —, et réglementaire — savoir
> ce que l'AI Act exige. AuditIQ n'invente aucun nouvel algorithme : il
> empaquète Fairlearn en levant les trois barrières simultanément. C'est une
> contribution d'ingénierie utile, pas une contribution algorithmique
> nouvelle. Et c'est précisément ce qui manque aujourd'hui à l'écosystème.

### Q4. « 34 répondants, dont 44 % de grandes entreprises — ce n'est pas une étude PME. »

**Réponse honnête, ne pas se défendre, attaquer la limite frontalement** :
> Vous avez raison de le souligner, et j'en discute explicitement dans la
> partie méthodologique. L'échantillon est modeste, la marge d'erreur à 95 %
> sur des proportions à 44 % est d'environ ±17 points, et le biais de
> recrutement par convenance via mes réseaux professionnels surreprésente le
> secteur tech et les structures plus grandes. Je n'ai jamais traité ces
> chiffres comme des résultats statistiquement représentatifs au sens d'une
> enquête INSEE. Je les utilise comme des **ordres de grandeur indicatifs**
> qui ont guidé la conception du MVP, et je les triangule systématiquement
> avec les études Harvard Business Review 2025 et Accountancy Europe 2025
> — qui, elles, portent sur des échantillons plus larges et confirment la
> tendance. Si je devais refaire ce travail dans le cadre d'une thèse, le
> volet quantitatif serait évidemment à élargir.

### Q5. « Comment mesurez-vous "facilement" dans votre problématique ? »

**Réponse** :
> J'ai défini "facilement" de manière opérationnelle dans l'introduction :
> la possibilité pour un professionnel non spécialiste, disposant de
> compétences numériques de base, d'effectuer un audit de fairness en quelques
> étapes sans coder ni recourir à un prestataire externe. Et j'ai construit
> un protocole d'évaluation pour mesurer cette définition : score SUS — System
> Usability Scale de Brooke 1996 —, time-on-task, taux de complétion,
> comparaison contre Fairlearn en ligne de commande, échelle de confiance
> auto-déclarée avant et après. Le protocole complet est en annexe. Les
> sessions ont été menées avec [N] testeurs PME ; le score SUS moyen est de
> [X], au-dessus du seuil de 70 considéré comme bon dans la littérature, et
> le time-on-task médian est de [Y] minutes contre [Z] pour Fairlearn CLI.
> Ces chiffres ne sont pas un certificat — l'échantillon de test est petit —
> mais ils sont mesurés, pas affirmés.

> **À compléter une fois les sessions menées. Si non encore mené à la
> soutenance, dire :** « Le protocole est défini, les testeurs identifiés, les
> sessions sont planifiées sur [période]. Je préfère présenter une définition
> opérationnelle mesurable et un protocole rigoureux plutôt qu'une affirmation
> non étayée. »

### Q6. « Vous utilisez Google Gemini, un LLM américain, dans un outil de conformité européen. C'est cohérent ? »

**Réponse** :
> C'est une excellente question, et c'est une limite que je discute en
> partie 5.2.1. Le choix de Gemini pour le MVP s'explique par la qualité du
> langage naturel et le coût quasi nul à petite échelle — c'est un arbitrage
> pragmatique. Mais je le reconnais : utiliser un LLM US pour aider à la
> conformité européenne soulève une ironie qu'il faut traiter dans une version
> production. Trois pistes d'évolution sont identifiées dans la conclusion :
> migration vers Mistral hébergé en France, utilisation de modèles
> open-weight comme Llama ou Qwen sur infrastructure européenne, ou encore
> Claude via Anthropic Europe. Pour le MVP académique, le risque est limité
> parce que les données utilisateur ne transitent pas par Gemini — seule la
> structure des résultats anonymisés est envoyée pour générer la
> recommandation textuelle.

### Q7. « Quelle est l'innovation réelle ? Empaqueter Fairlearn dans une UI, c'est de l'engineering, pas un mémoire. »

**Réponse** :
> Vous avez raison sur le fait que la stack technique n'est pas l'innovation.
> L'innovation se situe à trois niveaux. Premièrement, conceptuel : le cadre
> de la triple interface — cognitive, technique, réglementaire — comme grille
> d'analyse du fossé entre les outils existants et les utilisateurs PME. Je
> ne l'ai pas trouvé formulé ainsi dans la littérature, et j'ai vérifié.
> Deuxièmement, méthodologique : la combinaison d'un mode supervisé classique
> avec un mode non supervisé inspiré d'Algorithm Audit et un mode LLM
> inspiré de LangBiTe, dans une seule plateforme orientée non-experts. Aucun
> outil existant à ma connaissance ne combine ces trois modalités.
> Troisièmement, empirique : la validation auprès de 34 PME francophones
> documente un besoin que la littérature anglo-saxonne survole. Le mémoire
> n'invente pas un nouvel algorithme de fairness, et il l'assume. Il propose
> une intégration originale et empiriquement ancrée d'outils existants pour
> une cible négligée.

### Q8. « Le dilemme de l'audit : votre outil va inciter à documenter des biais sans solution, ce qui aggrave la responsabilité du dirigeant. »

**Réponse** :
> Ce point est explicitement traité dans la partie qualitative — c'est un
> thème qui est revenu spontanément en entretien. La réponse d'AuditIQ tient
> en trois points. D'abord, le rapport généré n'est pas un constat d'échec :
> il documente une démarche de diligence proportionnée au sens de l'article 9
> — et la jurisprudence en matière de discrimination indirecte valorise la
> démonstration d'une démarche d'évaluation. Ensuite, AuditIQ ne se contente
> pas de diagnostiquer : il génère des recommandations actionnables et
> hiérarchisées par faisabilité, pour ne pas laisser l'utilisateur face à un
> diagnostic sans suite. Enfin, la proposition de valeur est claire dans
> l'interface : AuditIQ est un outil d'aide à la conformité, pas un
> certificat. Il est conçu pour s'inscrire dans une démarche d'amélioration
> continue, pas pour produire un instantané accusateur.

### Q9. « Pourquoi pas un audit par un cabinet externe — c'est plus sérieux. »

**Réponse** :
> Parce que c'est inaccessible. Mon enquête montre que 82 % des répondants
> disposent de moins de 2 000 euros de budget pour l'audit éthique IA, et que
> 35 % ont zéro euro. Les audits externes pratiqués sur le marché — par
> exemple à New York où la Local Law 144 a structuré une offre — coûtent
> entre 5 000 et 50 000 euros. Le décalage est rédhibitoire. AuditIQ ne
> remplace pas un audit externe pour un système critique en production avec
> enjeux contentieux. Il offre une alternative pour l'immense majorité des
> PME qui aujourd'hui ne font *rien*. Et faire quelque chose de modeste vaut
> mieux que rien.

### Q10. « Vous parlez de PME *françaises* mais qu'est-ce qui est spécifiquement français ? »

**Réponse** :
> Trois choses. Le contexte juridique : le module d'enrichissement des
> rapports fait correspondre chaque obligation AI Act à des références de
> droit français — Code du travail L.1132-1 et suivants pour le recrutement,
> Loi Informatique et Libertés et RGPD pour le traitement, Code des assurances
> et supervision ACPR pour le scoring crédit, références aux positions de la
> CNIL et du Défenseur des droits sur les algorithmes. Les templates
> sectoriels : quatre cas d'usage typiquement français — recrutement par ATS,
> scoring crédit néo-banque, tarification assurance, chatbot service client —
> avec les attributs sensibles à examiner et les régulateurs compétents pour
> chacun. La langue, enfin : interface, rapports, glossaire, recommandations,
> tout est en français, sans jargon anglais non traduit. C'est trivial mais
> c'est une vraie barrière dans Fairlearn dont la documentation est
> exclusivement en anglais.

### Q11. « Et la sécurité ? Vous manipulez des données qui peuvent contenir des informations personnelles. »

**Réponse** :
> La conformité RGPD est intégrée dès la conception. Les jeux de données
> uploadés sont traités côté serveur pour le calcul des métriques mais ne
> sont pas conservés au-delà de la session, sauf demande explicite de
> l'utilisateur. L'authentification passe par des tokens JWT avec expiration,
> les mots de passe sont hachés en Bcrypt, le rate limiting protège les
> endpoints sensibles, et la séparation tenant est assurée par les Row Level
> Security policies de Supabase. Le module non supervisé a un avantage
> spécifique RGPD : il ne nécessite pas la collecte d'attributs sensibles
> supplémentaires, ce qui réduit l'exposition. Pour une version production
> visant des secteurs régulés, un audit de sécurité externe et une
> certification ISO 27001 seraient des prérequis — c'est documenté dans la
> conclusion comme une étape post-MVP.

### Q12. « Sur quoi feriez-vous porter une thèse ? »

**Réponse** :
> Trois pistes que j'ai identifiées en conclusion. D'abord, l'articulation
> formelle entre les définitions juridiques de la non-discrimination en droit
> européen — directe versus indirecte — et les définitions computationnelles
> de la fairness. Wachter, Mittelstadt et Russell ont ouvert ce chantier
> en 2021, mais leur conclusion reste largement non opérationnalisée dans
> les outils. Ensuite, l'efficacité longitudinale des outils d'audit non
> supervisé sur les biais réels en production, avec un protocole en
> conditions écologiques. Enfin, la gouvernance algorithmique comme champ
> de recherche à part entière, à l'intersection du droit, de l'éthique, du
> machine learning et des sciences de gestion. C'est un champ encore jeune,
> très majoritairement anglophone, et où une perspective européenne ancrée
> sur l'AI Act manque cruellement.

---

## 3. Pièges à NE PAS faire pendant la soutenance

- Ne PAS prétendre qu'AuditIQ couvre toute la conformité AI Act. Tu perdras
  la confiance du jury en cinq minutes.
- Ne PAS minimiser la taille de l'échantillon. Frontalement, dis "n=34, je
  l'assume comme ordre de grandeur, voici les triangulations".
- Ne PAS te défendre quand le jury attaque. Acquiesce sur ce qui est juste,
  puis reformule pour montrer comment ta démarche en tient compte.
- Ne PAS dire "j'aurais aimé faire X mais je n'ai pas eu le temps". Dis "X
  est dans la roadmap post-MVP, et voici pourquoi j'ai priorisé Y dans le
  cadre temporel du mémoire".
- Ne PAS lire tes slides. Le jury a déjà lu le mémoire, il veut voir ton
  jugement, pas ton récit.
- Ne PAS faire de démo si le wifi n'est pas garanti. Prépare une vidéo de
  2 min de l'audit complet en fallback.

---

## 4. Démo : le scénario qui marche à tous les coups

1. Ouvre AuditIQ. Montre la sidebar simplifiée : 10 entrées, pas plus.
   Commente : "L'amputation des modules hors-scope est un choix de design.
   Chaque entrée correspond à une fonction de la problématique."
2. Va sur "Nouvel Audit". Upload un CSV pré-préparé (Adult Census Income
   sous-échantillonné à 5000 lignes) que tu auras testé 100 fois avant.
3. Lance l'audit supervisé. Montre le passage en cinq étapes guidées.
   Commente : "Wizard plutôt que dashboard. Décision explicite contre la
   surcharge cognitive."
4. Arrive aux résultats. Pointe les feux tricolores. Commente : "On lit le
   risque en deux secondes. Détails accessibles en un clic pour l'auditeur
   averti."
5. Génère le rapport PDF. Ouvre-le. Pointe la section "Cadre juridique
   français applicable". Commente : "C'est le pont entre la métrique
   technique et l'obligation réglementaire — la triple interface que je
   décris dans le mémoire."
6. Va sur "Détection non supervisée". Lance la même analyse sans labels.
   Montre les clusters caractérisés. Commente : "Pour les PME qui ne peuvent
   pas légalement collecter d'attributs sensibles."
7. Si le temps le permet : montre la page "Audit Chatbot/LLM" et explique
   le principe sans nécessairement faire un appel live (risque réseau).

Durée cible : 4 minutes. Pas plus.

---

## 5. Slides — 8 slides max, format 15 min de présentation

1. **Titre + nom + question** — 30 secondes.
2. **Le problème en chiffres** — 38 % des PME ignorent les biais, 82 % ont
   moins de 2 000 euros de budget, 17 % utilisent des chatbots non audités.
3. **Le paradoxe** — Fairlearn existe, AIF360 existe, l'AI Act existe. Mais
   personne ne connecte les trois pour les PME. C'est le triple fossé.
4. **Le concept original : la triple interface** — schéma cognitive /
   technique / réglementaire.
5. **AuditIQ : trois modules complémentaires** — supervisé, non supervisé,
   LLM. Une diapo par module.
6. **Démo** — 4 min, scénario ci-dessus.
7. **Évaluation** — chiffres SUS, time-on-task, ce qui marche et ce qui
   coince.
8. **Conclusion** — limites assumées, contributions, pistes thèse.

---

## 6. Mantra à se répéter avant d'entrer

> Le jury n'attend pas la perfection. Il attend de la lucidité.
> Chaque limite que je verbalise avant lui est une attaque qu'il ne portera
> pas. Chaque chiffre que j'avance, je peux l'expliquer. Chaque choix que
> j'ai fait, je peux le justifier — y compris ceux qui n'étaient pas les bons.
