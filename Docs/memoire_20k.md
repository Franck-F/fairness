

**EPITECH DIGITAL SCHOOL**

Master of Science — Promotion 2024-2026

**CONSULTING PROJECT**

 **Comment permettre aux PME françaises de détecter et documenter les biais de leurs algorithmes IA, en vue de leur conformité progressive à l'AI Act européen ?**

Présenté par : **Franck F.**

Année universitaire : **2024-2026**

Date de soumission : **\[à compléter\]**

Directeur de mémoire : **\[à compléter\]**

*Mémoire de projet réalisé dans le cadre du programme Grande École*  
*d'Epitech Digital School*

# **REMERCIEMENTS**

Je voudrais d'abord remercier mon directeur de mémoire, *\[nom à compléter\]*, pour son accompagnement pendant ce projet. Ses retours, toujours précis et parfois un peu secs, m'ont poussé à aller plus loin.

Merci aussi à toute l'équipe pédagogique d'Epitech Digital School, et tout particulièrement à Mme Laura Hassan, pour avoir créé un cadre qui laisse de la place à l'initiative.

Merci aux 34 professionnels qui ont pris le temps de répondre à mon sondage. Et plus encore à ceux qui ont accepté de prolonger l'échange lors d'entretiens. Sans leur franchise sur leurs pratiques, leurs doutes et leurs attentes, AuditIQ serait resté un exercice technique déconnecté du réel.

Un remerciement particulier à la communauté open source de Fairlearn. Leur travail est le socle technique d'AuditIQ. Construire un outil d'audit de fairness en partant de zéro aurait été irréaliste pour un projet solo.

Merci à mes proches pour leur patience, et à tous ceux qui m'ont aidé à affiner ma problématique, à tester mon prototype, ou simplement à garder la motivation.

# **RÉSUMÉ**

Les PME françaises se mettent à utiliser l'IA. Chatbots, tri de CV, scoring de clients : les usages se multiplient. Le souci, c'est qu'à peu près personne, dans cet écosystème, ne se demande si ces outils sont biaisés. Or l'AI Act européen, entré en application en août 2024, impose des obligations claires aux entreprises qui déploient de l'IA dans des domaines à haut risque — recrutement, crédit, accès aux services. Et ces obligations ne font pas vraiment de distinction selon la taille de l'entreprise. Les PME, elles, n'ont ni expertise data science, ni budget d'audit, ni outils adaptés pour répondre à ces exigences.

Pour creuser cette question, j'ai mené une enquête mixte. D'abord un sondage auprès de 34 professionnels pour avoir des chiffres. Ensuite des entretiens semi-directifs pour comprendre ce qu'il y a derrière les chiffres. Les deux confirment qu'il existe un fossé énorme entre ce que la loi demande et ce que les PME peuvent réellement faire. En réponse, j'ai conçu et développé **AuditIQ**, une plateforme SaaS qui permet à des non-spécialistes d'auditer la fairness de leurs modèles d'IA. Les résultats sont affichés avec un système de feux tricolores, et l'outil génère des rapports de conformité alignés sur les exigences de l'AI Act — le tout sans avoir à écrire une seule ligne de code.

**Mots-clés :** biais algorithmiques, intelligence artificielle, AI Act, PME, fairness, audit, Fairlearn, conformité réglementaire, SaaS

# **ABSTRACT**

The growing adoption of artificial intelligence by small and medium-sized enterprises (SMEs) raises a critical issue: the detection of algorithmic bias. With the European AI Act (Regulation 2024/1689) entering into force in August 2024, companies developing or deploying AI systems — particularly in high-risk domains such as recruitment or credit scoring — face mandatory data governance and bias assessment obligations. However, SMEs typically lack the technical expertise, budget, and appropriate tools to meet these requirements.

This project-based thesis explores this issue through a mixed-methods approach combining a quantitative survey (34 professionals) and qualitative semi-structured interviews, confirming the significant gap between regulatory obligations and SMEs' operational reality. In response, it presents the design and development of **AuditIQ**, an open-source SaaS platform enabling non-specialists to audit AI model fairness, visualize results through a traffic-light system, and generate compliance reports aligned with AI Act requirements — all without programming skills.

**Keywords:** algorithmic bias, artificial intelligence, AI Act, SMEs, fairness, audit, Fairlearn, regulatory compliance, SaaS

# **SOMMAIRE**

**[REMERCIEMENTS	2](#heading=)**

[**RÉSUMÉ	3**](#heading=)

[**ABSTRACT	4**](#heading=)

[**SOMMAIRE	5**](#heading=)

[**INTRODUCTION	8**](#heading=)

[**PARTIE 1 : DÉFINITION DU PROBLÈME	11**](#heading=)

[1.1 Identification du problème	11](#heading=)

[1.2 Pertinence du problème	13](#heading=)

[1.3 Objectifs du projet	16](#heading=)

[**PARTIE 2 : REVUE DE LITTÉRATURE	17**](#heading=)

[2.1 Les biais algorithmiques : de quoi parle-t-on ?	17](#heading=)

[2.1.1 Définition et origines	17](#heading=)

[2.1.2 Typologies de préjudices	18](#heading=)

[2.1.3 Cas concrets de biais dans des contextes PME	19](#heading=)

[2.1.4 Métriques de fairness : un champ en tension	20](#heading=)

[2.1.5 Le débat philosophique : quelle justice pour les algorithmes ?	22](#heading=)

[2.2 Le cadre réglementaire : l'AI Act européen	23](#heading=)

[2.2.1 Genèse et architecture du règlement	23](#heading=)

[2.2.2 Les obligations en matière de biais et de fairness	24](#heading=)

[2.2.3 Les PME face à l'AI Act : entre obligations et allégements	26](#heading=)

[2.2.4 Standards et normes techniques	26](#heading=)

[2.3 L'écosystème des outils de détection des biais	27](#heading=)

[2.3.1 Les frameworks open source	27](#heading=)

[2.3.2 Les outils émergents (2024-2025)	28](#heading=)

[2.3.3 Les solutions commerciales	29](#heading=)

[2.3.4 Les lacunes identifiées	29](#heading=)

[2.4 Conclusion de la revue de littérature	30](#heading=)

[**PARTIE 3 : CHOIX DE LA MÉTHODOLOGIE	31**](#heading=)

[3.1 Détermination de l'approche de recherche	31](#heading=)

[3.1.1 Pourquoi une approche mixte ?	31](#heading=)

[3.1.2 Le volet quantitatif : conception et diffusion du sondage	32](#heading=)

[3.1.3 Le volet qualitatif : entretiens semi-directifs	32](#heading=)

[3.1.4 Limites méthodologiques et stratégies d'atténuation	33](#heading=)

[3.2 Méthodologie de développement du MVP	34](#heading=)

[3.2.1 Le Design Thinking comme cadre de conception	34](#heading=)

[3.2.2 La méthodologie agile pour le développement	35](#heading=)

[3.3 Outils et technologies	36](#heading=)

[3.4 Considérations éthiques	37](#heading=)

[3.5 Conclusion de la méthodologie	37](#heading=)

[**PARTIE 4 : ANALYSE ET DÉVELOPPEMENT	39**](#heading=)

[4.1 Analyse des données collectées	39](#heading=)

[4.1.1 Analyse quantitative : résultats du sondage	39](#heading=)

[4.1.2 Analyse qualitative : enseignements des entretiens	43](#heading=)

[4.1.3 Synthèse : du diagnostic au cahier des charges	45](#heading=)

[4.2 Développement du MVP : AuditIQ	45](#heading=)

[4.2.1 Vision produit et positionnement	45](#heading=)

[4.2.2 Architecture technique	46](#heading=)

[4.2.3 Le moteur de fairness : cœur fonctionnel d'AuditIQ	47](#heading=)

[4.2.4 L'Auto EDA : analyse exploratoire automatisée	48](#heading=)

[4.2.5 La génération de rapports de conformité	49](#heading=)

[4.2.6 Les recommandations assistées par IA	50](#heading=)

[4.2.7 Le système d'alertes	50](#heading=)

[4.2.8 La gestion d'équipe et les permissions	51](#heading=)

[4.2.9 Déploiement et infrastructure	51](#heading=)

[4.2.10 Choix de design UX et accessibilité	52](#heading=)

[4.3 Évaluation du prototype	53](#heading=)

[4.3.1 Tests de fonctionnalité	54](#heading=)

[4.3.2 Retours utilisateurs	54](#heading=)

[4.3.3 Conformité et sécurité	54](#heading=)

[4.4 Conclusion de la partie 4	55](#heading=)

[**PARTIE 5 : CONCLUSION ET RECOMMANDATIONS	56**](#heading=)

[5.1 Synthèse des principaux résultats	56](#heading=)

[5.2 Discussion sur les implications des résultats	57](#heading=)

[5.2.1 Implications pratiques	57](#heading=)

[5.2.2 Contributions à la littérature	58](#heading=)

[5.3 Recommandations	59](#heading=)

[5.3.1 Pour les PME	59](#heading=)

[5.3.2 Pour les décideurs politiques et les régulateurs	60](#heading=)

[5.3.3 Pour les recherches futures	61](#heading=)

[5.4 Réflexion personnelle et DevPCP	62](#heading=)

[5.4.1 Évolution de ma compréhension du problème	62](#heading=)

[5.4.2 Compétences développées	63](#heading=)

[5.4.3 Difficultés rencontrées et leçons tirées	64](#heading=)

[5.4.4 Dimension collective et perspectives	64](#heading=)

[5.5 Conclusion générale	65](#heading=)

[**LISTE DES FIGURES	67**](#heading=)

[**BIBLIOGRAPHIE	68**](#heading=)

[Textes réglementaires	68](#heading=)

[Articles scientifiques et rapports de recherche	68](#heading=)

[Ressources en ligne et rapports professionnels	70](#heading=)

[Outils et frameworks techniques	70](#heading=)

[**ANNEXES	71**](#heading=)

[Annexe A : Questionnaire du sondage « IA et Éthique dans les PME — Enquête 2025 »	71](#heading=)

[Annexe B : Résultats chiffrés du sondage (34 répondants)	73](#heading=)

[Annexe C : AuditIQ — Accès au MVP	74](#heading=)

[Annexe D : Stack technique d'AuditIQ	74](#heading=)

[Annexe E : Captures d'écran complémentaires d'AuditIQ	74](#heading=)

* 

# **INTRODUCTION**

L'intelligence artificielle n'est plus réservée aux géants de la tech. Des PME de dix, cinquante ou deux cents salariés déploient des chatbots, automatisent le tri de CV, ou s'appuient sur des modèles de scoring. Cette démocratisation est plutôt une bonne nouvelle, mais elle s'accompagne d'un angle mort : les biais algorithmiques.

Un algorithme de recrutement qui défavorise les candidatures féminines. Un modèle de crédit qui pénalise certains quartiers. Un chatbot qui répond plus sèchement face à un prénom à consonance étrangère. Ces scénarios ont été documentés. Amazon a abandonné en 2018 son outil de recrutement automatisé qui pénalisait les CV contenant le mot « women's ». Buolamwini et Gebru (2018), dans *Gender Shades*, ont montré que les systèmes de reconnaissance faciale atteignaient 99 % d'exactitude pour les hommes blancs, mais seulement 65 % pour les femmes noires. Ces cas concernaient des multinationales avec des moyens considérables. Qu'en est-il des PME ?

C'est dans ce contexte qu'intervient l'AI Act (Règlement UE 2024/1689), entré en vigueur le 1er août 2024. L'article 10 exige une gouvernance rigoureuse des données d'entraînement, incluant l'examen des biais. L'article 9 impose un système de gestion des risques couvrant le cycle de vie de l'IA. L'article 11 exige une documentation technique détaillée. L'article 14 prescrit une supervision humaine effective. L'article 15 fixe des exigences d'exactitude et de robustesse. L'article 17 impose un système de management de la qualité. L'article 43 organise les procédures d'évaluation de la conformité. L'article 50 introduit des obligations de transparence pour les IA génératives.

Soyons honnêtes : un outil développé en solo ne peut pas couvrir l'ensemble de ces obligations. AuditIQ adresse une brique précise mais stratégique : **la détection et la documentation des biais**, soit la couche opérationnelle des articles 10 et 11. D'après ma lecture du règlement, cette brique représente environ 15 % des exigences totales d'un dossier de conformité « haut risque ». C'est une part minoritaire, mais c'est la brique la plus technique et la plus inaccessible aux profils non-data. AuditIQ se positionne comme un **outil de première ligne** : il sert à amorcer la démarche et à produire les premiers livrables exploitables. Ce n'est pas un substitut à un audit juridique intégral.

Mon enquête de terrain (n=34) a confirmé ce que je soupçonnais : 38,2 % des répondants n'avaient jamais entendu parler de biais algorithmiques. 35,3 % ne disposaient d'aucun budget pour un audit éthique. Et pourtant, 44,1 % reconnaissaient que leurs systèmes pouvaient discriminer. 17,6 % déclaraient déjà utiliser un chatbot grand public. Il y a là un décalage frappant entre la conscience du risque et la capacité d'action.

Ma problématique :

> **Comment permettre aux PME françaises de détecter facilement les biais de leurs algorithmes IA pour se conformer à l'AI Act européen ?**

**« Françaises ».** Le droit français superpose à l'AI Act un corpus anti-discrimination préexistant. L'article L.1132-1 du Code du travail interdit toute discrimination dans l'embauche. La loi du 27 mai 2008 fixe 25 critères protégés. La CNIL encadre la collecte d'attributs sensibles au titre du RGPD. Le Défenseur des droits peut être saisi par tout salarié ou candidat. L'ACPR supervise les algorithmes de scoring financier. Cette superposition crée des contraintes spécifiques qu'une approche « européenne générale » ne traite pas.

**« Facilement ».** Je la définis comme la capacité pour un non-spécialiste à effectuer un audit de fairness exploitable en moins d'une heure, sans ligne de code et sans prestataire externe. Le protocole d'évaluation (section 4.3) permettra de mesurer cette facilité sur un échantillon de 6 à 8 testeurs PME.

**« Détecter ».** Détecter n'est pas corriger, et ce n'est pas certifier. AuditIQ aide à voir le problème. Aucun verdict binaire « conforme / non conforme » n'est jamais affiché.

La refonte de scope du projet mérite d'être signalée. Dans sa première version, AuditIQ cherchait à couvrir un périmètre trop large. La confrontation au critère « facilement » a imposé un recentrage. Le MVP repose sur **trois piliers** :

1. **Un audit supervisé classique** (Module 1), pour les PME disposant d'un jeu de données labellisé avec une variable cible et un attribut sensible. Ce module s'appuie sur Fairlearn et propose les métriques de référence (Demographic Parity, Equal Opportunity, Equalized Odds, règle des quatre cinquièmes), traduites via un système de feux tricolores.
2. **Une détection non supervisée** (Module 2), pour les PME qui ne peuvent pas collecter d'attributs sensibles. Ce module, inspiré d'Algorithm Audit (2024), s'appuie sur un pipeline de clustering (KMeans), un test du Khi-deux pour identifier les clusters déviants, et une caractérisation post-hoc par les features dominantes.
3. **Un audit LLM / chatbot** (Module 3), pour les 17 % de PME utilisant un chatbot. Ce module, inspiré de LangBiTe (Morales et al., 2024), repose sur 10 prompts pairés bilingues couvrant genre, origine, âge, religion, handicap et orientation. Il mesure les écarts de longueur, de sentiment et de taux de refus.

Ces trois modules s'articulent dans une même interface, via le même système de feux tricolores et les mêmes rapports de conformité enrichis de références au droit français. Ensemble, ils répondent à la **triple lacune** : cognitive (les utilisateurs ne comprennent pas la fairness), technique (les outils sont inaccessibles), réglementaire (les métriques ne sont pas reliées au droit applicable).

Le mémoire s'organise en cinq parties. La première définit le problème. La deuxième propose une revue de littérature couvrant les biais, l'AI Act, et l'état de l'art des outils. La troisième détaille la méthodologie. La quatrième présente l'analyse des données et le développement d'AuditIQ. La cinquième tire les conclusions et formule des recommandations.

Mon ambition est modeste : réduire la barrière d'entrée pour les PME françaises, en leur offrant un outil qui traduit des concepts complexes en actions concrètes. Chouldechova (2017) a démontré l'incompatibilité entre plusieurs définitions de fairness dès lors que les taux de base diffèrent entre groupes. Wachter, Mittelstadt et Russell (2021) ont souligné que tout choix de métrique est un choix normatif. AuditIQ aide les PME à poser les bonnes questions -- pas à y répondre à leur place.

# **PARTIE 1 : DÉFINITION DU PROBLÈME**

## **1.1 Identification du problème**

Le problème se situe à l'intersection de trois constats.

**Premier constat : les PME adoptent l'IA sans évaluer ses risques éthiques.** Mon enquête (n=34) le confirme : 17 % utilisent l'IA pour le recrutement, 17 % pour le service client (chatbots), 14,9 % pour le marketing personnalisé. Ces usages sont ceux que l'AI Act identifie comme potentiellement « haut risque ». Or, 38,2 % des répondants n'avaient jamais entendu parler de biais algorithmiques. Et 26,5 % avouent ne pas savoir vérifier si leurs outils discriminent. On parle d'outils en production, qui influencent des décisions concrètes sur des personnes réelles.

***\[Figure 1 : Répartition sectorielle des répondants\]** Source : Sondage « IA et Éthique dans les PME — Enquête 2025 », 34 répondants.*

![][image1]

***\[Figure 2 : Connaissance des biais algorithmiques\]** Source : Sondage, Q4.* 

**Deuxième constat : le cadre réglementaire se durcit, mais les PME ne sont pas prêtes.** L'AI Act ne fait pas de distinction selon la taille de l'entreprise. Certes, le règlement prévoit des allégements : systèmes de qualité simplifiés (**article 17**), bacs à sable réglementaires (**article 57**), frais réduits. Le Digital Omnibus Proposal (mars 2026) propose de repousser certaines échéances à décembre 2027 et de réduire la charge administrative de 35 % pour les PME d'ici 2029. Mais les articles 9 et 10 exigent toujours un système de gestion des risques et une gouvernance des données incluant la détection des biais.

Mon sondage confirme cette tension : 35,3 % déclarent un budget de 0 euro pour l'audit éthique IA. En ajoutant les 17,6 % disposant de moins de 500 euros, plus de la moitié n'a quasiment aucune marge financière. Seuls 5,9 % disposent de plus de 2 000 euros.

***\[Figure 3 : Budget annuel pour audit éthique IA\]** Source : Sondage, Q7.* 

**Troisième constat : les outils existants ne répondent pas aux besoins des PME.** Fairlearn, AIF360, FAT Forensics, TensorFlow Fairness Indicators sont puissants et gratuits, mais s'adressent à des data scientists. Aucun ne propose de lien natif avec l'AI Act. Les solutions commerciales (Fiddler AI, TruEra, Holistic AI) ciblent les grandes entreprises avec des tarifs incompatibles avec les budgets PME.

## **1.2 Pertinence du problème**

**Dynamique réglementaire.** L'AI Act est un règlement en vigueur avec des sanctions pouvant atteindre 35 millions d'euros ou 7 % du chiffre d'affaires mondial (**article 99**). Les infractions de documentation peuvent entraîner jusqu'à 15 millions d'euros ou 3 % du chiffre d'affaires. Les interdictions sont en vigueur depuis février 2025, les obligations de transparence depuis août 2025, et les obligations pour les systèmes à haut risque s'appliqueront dès août 2026.

**Dynamique de marché.** Selon la Commission européenne (2024), 28 % des PME européennes utilisent au moins une technologie d'IA, contre 12 % en 2021. Mon sondage reflète cette tendance : 85 % des répondants utilisent l'IA. L'« invisibilité » de l'IA dans les processus métier (CRM, ERP) est un facteur de risque majeur.

**Dynamique sociale.** L'Eurobaromètre 2024 révèle que 67 % des Européens estiment que les décisions automatisées devraient faire l'objet d'une supervision humaine, et 72 % s'inquiètent des risques de discrimination.

**Dynamique concurrentielle.** La fairness peut devenir un avantage concurrentiel. Plusieurs répondants mentionnent que leurs grands clients commencent à exiger des engagements en matière d'IA responsable.

## **1.3 Objectifs du projet**

Quatre objectifs SMART :

**Objectif 1** — Comprendre les besoins et freins des PME via enquête quantitative (n>=30) et qualitative (entretiens semi-directifs). Échéance : T1 2025.

**Objectif 2** — Concevoir et développer AuditIQ, un MVP permettant à un non-technique d'auditer la fairness, de visualiser les résultats et de générer un rapport aligné sur l'AI Act. Échéance : fin S1 2025.

**Objectif 3** — Évaluer l'utilisabilité via tests utilisateurs et collecte de retours structurés. Échéance : avant la soutenance.

**Objectif 4** — Formuler des recommandations actionnables pour les PME et les décideurs, intégrées à la conclusion.

# **PARTIE 2 : REVUE DE LITTÉRATURE**

## **2.1 Les biais algorithmiques : de quoi parle-t-on ?**

### **2.1.1 Définition et origines**

En statistique, un biais est un écart systématique entre une estimation et la valeur réelle. En sciences sociales, il renvoie à un traitement différencié injustifié sur la base de caractéristiques protégées. Dans le contexte de l'IA, un algorithme « biaisé » produit des décisions qui varient de manière systématique et injustifiée selon l'appartenance démographique.

Mehrabi et al. (2021) distinguent trois grandes familles : les **biais de données** (sous-représentation, étiquetage reflétant des préjugés, données historiques inégalitaires), les **biais algorithmiques** au sens strict (fonction objectif défavorisant des sous-groupes), et les **biais d'interaction** (boucles de rétroaction en déploiement). Une revue systématique de ScienceDirect (2024) identifie cinq sources primaires : déficiences des données, homogénéité démographique, corrélations parasites, comparateurs inappropriés, et biais cognitifs des concepteurs.

### **2.1.2 Typologies de préjudices**

Fairlearn distingue deux catégories. Les **préjudices d'allocation** surviennent quand un système accorde de manière inéquitable des ressources (scoring bancaire, tri de CV). Les **préjudices de qualité de service** se manifestent quand un système fonctionne moins bien pour certains groupes -- comme les 34,7 % d'erreur pour les femmes à peau foncée vs. 0,8 % pour les hommes à peau claire dans *Gender Shades* (Buolamwini et Gebru, 2018).

Cette distinction détermine le risque juridique : l'allocation expose au droit du travail (L.1132-1) et au droit européen (directive 2000/78/CE) ; la qualité de service est dommageable pour la relation client et potentiellement constitutive de discrimination dans l'accès aux services. Une troisième catégorie, les **préjudices de représentation**, renforce des stéréotypes sans conséquence directe sur l'allocation.

### **2.1.3 Cas concrets de biais dans des contextes PME**

**Le scoring de crédit dans les fintechs.** Le code postal, fortement corrélé à l'origine ethnique, peut reproduire du *redlining* sans le vouloir.

**Le tri de CV.** Bertrand et Mullainathan (2004) ont montré que les CV à consonance maghrébine reçoivent 25 à 40 % de réponses en moins en France. Un outil d'IA entraîné sur ces données reproduira mécaniquement cette discrimination.

**Les chatbots.** Les modèles NLP, entraînés sur du français standard, peuvent créer des disparités pour les locuteurs de français non standard.

### **2.1.4 Métriques de fairness : un champ en tension**

Le **Demographic Parity** exige la même proportion de résultats positifs dans tous les groupes. Intuitive, mais elle ignore la performance réelle. L'**Equal Opportunity** exige le même taux de vrais positifs entre groupes. Les **Equalized Odds** exigent l'égalité des taux de vrais positifs *et* de faux positifs. La **règle des quatre cinquièmes** (*four-fifths rule*) fixe un seuil pragmatique : le taux du groupe le moins favorisé ne doit pas être inférieur à 80 % de celui du groupe le plus favorisé.

Chouldechova (2017) et Kleinberg, Mullainathan et Raghavan (2016) ont démontré qu'il est impossible de satisfaire simultanément ces métriques. Tout choix de métrique est un choix normatif, pas seulement technique.

> **[FIGURE 5 — Tableau comparatif des métriques de fairness]** Tableau synthétique à 5 colonnes : Métrique | Définition simplifiée | Ce qu'elle mesure | Quand l'utiliser | Limite principale. Lignes : Demographic Parity, Equal Opportunity, Equalized Odds, Règle des 4/5. Utiliser un code couleur par complexité (vert = simple, orange = intermédiaire, rouge = avancé). Créer dans Word ou Excel.

Wachter, Mittelstadt et Russell (2021) montrent que les métriques de fairness ne correspondent pas aux définitions juridiques de la non-discrimination européenne, qui distingue discrimination directe et indirecte. La plupart des métriques ne captent que la directe ; un modèle peut produire une discrimination indirecte via des proxies (temps partiel, secteur d'activité). AuditIQ tente de combler partiellement ce décalage via ses recommandations contextualisées.

### **2.1.5 Le débat philosophique : quelle justice pour les algorithmes ?**

Le Demographic Parity s'inscrit dans une vision rawlsienne (égalité des résultats). L'Equal Opportunity relève d'une conception méritocratique (égalité des chances). Ce choix est un choix de société, le plus souvent laissé aux développeurs qui n'ont ni la formation ni le mandat pour le faire.

Pour les PME, les conséquences sont concrètes. Un cabinet choisissant le Demographic Parity devra sélectionner proportionnellement dans chaque groupe. Celui choisissant l'Equal Opportunity maintiendra peut-être les déséquilibres existants. AuditIQ présente cette nuance en langage clair, sans imposer de choix par défaut.

## **2.2 Le cadre réglementaire : l'AI Act européen**

### **2.2.1 Genèse et architecture du règlement**

L'AI Act (Règlement UE 2024/1689) est le premier cadre juridique mondial dédié à la régulation de l'IA. Adopté après trois ans de négociations, il repose sur une approche fondée sur le risque en quatre catégories.

> **[FIGURE 4 — Pyramide de classification des risques de l'AI Act]** Schéma pyramidal à 4 niveaux : base = Risque minimal (aucune obligation), puis Risque limité (obligations de transparence), puis Haut risque (obligations complètes : articles 9-15), sommet = Pratiques interdites (article 5). Indiquer les exemples pertinents PME à chaque niveau. Colorier du vert (bas) au rouge (haut). Utiliser PowerPoint ou draw.io.

Les **systèmes interdits** (article 5) incluent manipulation subliminale et notation sociale. Les **systèmes à haut risque** (articles 6-51) font l'objet d'obligations substantielles -- recrutement, scoring, accès aux services essentiels. Les **systèmes à risque limité** sont soumis à la transparence. Les **systèmes à risque minimal** n'ont aucune obligation spécifique. L'annexe III liste les domaines à haut risque. Mon sondage montre que 34 % des répondants utilisent l'IA pour le recrutement ou le scoring -- directement visés.

### **2.2.2 Les obligations en matière de biais et de fairness**

**L'article 9** impose un système de gestion des risques continu couvrant le cycle de vie, incluant les risques de discrimination.

**L'article 10** exige que les jeux de données soient représentatifs et exempts d'erreurs, et impose d'examiner les biais possibles. Son paragraphe 5 autorise exceptionnellement le traitement de données sensibles (origine, santé) dans le seul but de détecter les biais -- créant une tension productive avec le RGPD.

**L'article 15** exige des niveaux appropriés d'exactitude et de robustesse. **Les articles 11 et 12** imposent documentation technique et tenue de registres. **L'article 14** impose la supervision humaine -- un modèle de scoring tournant sans vérification humaine ne satisfait pas cette exigence.

### **2.2.3 Les PME face à l'AI Act : entre obligations et allégements**

L'article 17 étend aux PME les systèmes de qualité simplifiés. L'article 57 impose des bacs à sable réglementaires avec accès prioritaire PME d'ici août 2026. Le Digital Omnibus Proposal (mars 2026, 569 voix) propose de repousser les échéances à décembre 2027 et de réduire la charge de 35 % d'ici 2029.

Ces allégements portent sur la forme, pas le fond. Les obligations des articles 9 et 10 restent identiques quelle que soit la taille. Un rapport d'Accountancy Europe (2025) le souligne : « les allégements procéduraux ne dispensent pas de l'obligation de résultat en matière de fairness ».

### **2.2.4 Standards et normes techniques**

Le CEN/CENELEC JTC 21 a approuvé deux standards pertinents : le CEN/CLC/TR 18115:2024 sur la gouvernance des données, et l'ISO/IEC TS 12791:2024 sur le traitement des biais. Un article de Policy Review (2025) questionne la nature normative et politique de ces choix techniques.

## **2.3 L'écosystème des outils de détection des biais**

### **2.3.1 Les frameworks open source**

**Fairlearn** (Microsoft/Linux Foundation) repose sur la classe `MetricFrame` pour désagréger les métriques par groupe. Il propose six algorithmes de mitigation couvrant prétraitement (`CorrelationRemover`), entraînement (`ExponentiatedGradient`, `GridSearch`, `AdversarialFairnessClassifier`) et post-traitement (`ThresholdOptimizer`).

**AIF360** (IBM) propose plus de 70 métriques et 10 algorithmes, mais avec une courbe d'apprentissage raide. **FAT Forensics** (Bristol) est plus orienté recherche. D'autres outils existent : TensorFlow Fairness Indicators, Holistic AI Library, FairTest (Columbia).

Le problème commun : il faut savoir coder en Python. La documentation est en anglais. Pour un dirigeant de PME, c'est hors de portée.

### **2.3.2 Les outils émergents (2024-2025)**

**LangBiTe** (UOC / Luxembourg) teste les biais des LLM via plus de 300 prompts pairés couvrant sept catégories. Son alignement avec l'AI Act est explicite.

L'**outil d'Algorithm Audit** (Pays-Bas) détecte les biais sans labels démographiques, entièrement dans le navigateur. Reconnu par l'OCDE, il a été utilisé pour auditer un algorithme de profilage du gouvernement néerlandais appliqué à 250 000 étudiants.

### **2.3.3 Les solutions commerciales**

Fiddler AI, TruEra (acquis par Snowflake en 2025), Accenture ciblent des organisations avec budgets conséquents. Incompatible avec les 82 % de mon échantillon disposant de moins de 2 000 euros.

> **[FIGURE 6 — Tableau comparatif des outils de détection des biais]** Tableau à 7 colonnes : Outil | Développeur | Open Source ? | Interface graphique ? | Lien AI Act ? | Coût | Adapté PME ?. Lignes : Fairlearn, AIF360, FAT Forensics, LangBiTe, Algorithm Audit, Fiddler AI, TruEra, AuditIQ. Mettre AuditIQ en surbrillance pour montrer son positionnement unique (seul outil cochant : gratuit + interface graphique + lien AI Act + adapté PME). Créer dans Word ou Excel.

### **2.3.4 Les lacunes identifiées**

Quatre lacunes : (1) **Accessibilité** -- aucune interface graphique pour non-techniques. (2) **Alignement réglementaire** -- aucun lien métriques-AI Act. (3) **Génération de rapports** -- pas de rapports structurés pour auditeur. (4) **Guidance** -- pas de recommandations contextualisées pour le choix des métriques.

### **2.3.5 Synthèse : la triple lacune et le concept de triple interface**

Ce qui sépare les PME d'un audit de fairness effectif est une **triple lacune** indissociable. Je propose de la formaliser comme **triple interface** qu'un outil doit simultanément construire.

**L'interface cognitive** relie le vocabulaire formel de la fairness aux représentations d'un professionnel non expert. C'est une traduction sémantique. Bhatt et al. (2020) documentent la difficulté : les explications trop techniques sont ignorées, trop simples sont méprisées.

**L'interface technique** relie les données brutes (CSV, logs) à un pipeline de calcul. Les frameworks fournissent la puissance, mais laissent l'interface à construire. Dans une PME, personne ne la construit.

**L'interface réglementaire** relie les résultats numériques au corpus juridique applicable (AI Act, Code du travail, RGPD, CNIL, Défenseur des droits). C'est l'interface qu'aucun outil ne construit. La contribution la plus originale d'AuditIQ n'est pas dans ses algorithmes, mais dans cette troisième interface.

**L'accessibilité d'un outil d'audit se mesure à la qualité conjointe de ces trois interfaces.** Un outil qui excelle sur une seule échoue. La partie 4 détaille la concrétisation de cette ambition.

## **2.4 Conclusion de la revue de littérature**

Les fondements théoriques sont solides, les métriques formalisées, les algorithmes implémentés. Le cadre réglementaire est en place. Mais il existe un fossé entre cette richesse et la capacité réelle des PME. Ce fossé est un problème d'interface -- utilisateur, réglementaire, cognitive. C'est ce triple problème que le MVP AuditIQ se propose de résoudre.

# **PARTIE 3 : CHOIX DE LA MÉTHODOLOGIE**

## **3.1 Détermination de l'approche de recherche**

### **3.1.1 Pourquoi une approche mixte ?**

Ma problématique appelle à la fois des réponses mesurables et des compréhensions en profondeur. J'ai adopté un design séquentiel explicatif (Creswell et Plano Clark, 2018) : le volet quantitatif (sondage) cartographie le terrain, puis le volet qualitatif (entretiens) approfondit les résultats saillants.

> **[FIGURE 7 — Schéma du design méthodologique séquentiel explicatif]** Diagramme en flux horizontal : [Revue de littérature] → [Conception sondage] → [Collecte quanti (34 répondants)] → [Analyse préliminaire] → [Construction guide d'entretien] → [Entretiens semi-directifs] → [Analyse thématique] → [Cahier des charges MVP] → [Design Thinking + Développement Agile] → [MVP AuditIQ]. Deux couleurs : bleu pour la phase recherche, orange pour la phase développement. Créer avec draw.io, Miro ou PowerPoint.

### **3.1.2 Le volet quantitatif : conception et diffusion du sondage**

Le sondage (Microsoft Forms) comprenait dix questions couvrant profil, usages IA, connaissance des biais, et intérêt pour un outil. J'ai obtenu 34 réponses exploitables -- un échantillon modeste, qui ne prétend pas à la représentativité statistique, mais suffisant pour informer la conception du MVP.

La composition sectorielle : technologies (32,4 %), finance/assurance (20,6 %), santé (11,8 %), services (8,8 %), industrie (5,9 %), divers (20,6 %). La répartition par taille inclut 44,1 % d'entreprises de plus de 250 salariés ; j'ai conservé ces réponses pour la comparaison avec les petites structures.

### **3.1.3 Le volet qualitatif : entretiens semi-directifs**

Des entretiens semi-directifs ont couvert trois axes : expérience concrète avec l'IA, perception des risques, et attentes vis-à-vis d'un outil. Les transcriptions ont été analysées par analyse thématique (Braun et Clarke, 2006), avec codage ouvert puis regroupement en thèmes émergents.

### **3.1.4 Limites méthodologiques et stratégies d'atténuation**

**Biais de sélection.** L'échantillon est probablement plus sensibilisé que la moyenne. Si 38 % ignorent les biais algorithmiques, le chiffre réel dépasse probablement 50 %.

**Taille.** Avec n=34, la marge d'erreur à 95 % est d'environ +/-17 points. Les pourcentages sont des ordres de grandeur, pas des mesures précises.

**Désirabilité sociale.** Atténuée par des questions indirectes et un séquencement descriptif-évaluatif.

**Triangulation.** Croisement systématique sondage/entretiens/littérature pour renforcer la confiance.

## **3.2 Méthodologie de développement du MVP**

### **3.2.1 Le Design Thinking comme cadre de conception**

Le processus s'est décliné en cinq phases. **Empathie** (sondage + entretiens). **Définition** : « Les PME ont besoin d'un outil d'évaluation de fairness sans expertise data science, produisant une documentation AI Act, à coût quasi nul. » **Idéation** : j'ai retenu la plateforme SaaS pour son accessibilité universelle et sa mise à jour centralisée. **Prototypage** : développement itératif. **Test** : sessions d'évaluation avec utilisateurs cibles.

> **[FIGURE 8 — Schéma des 5 phases du Design Thinking appliquées au projet]** Diagramme en double diamant ou en 5 hexagones enchaînés : Empathie (sondage + entretiens) → Définition (énoncé du besoin) → Idéation (exploration solutions : plugin tableur, app desktop, SaaS...) → Prototypage (développement itératif AuditIQ) → Test (sessions utilisateurs). Pour chaque phase, indiquer les livrables produits. Créer avec Canva, Figma ou PowerPoint.

### **3.2.2 La méthodologie agile pour le développement**

Sprints de deux semaines, priorités définies par valeur utilisateur. Backlog géré via un outil de gestion de projet partagé.

## **3.3 Outils et technologies**

**Frontend** : Next.js 16, TypeScript, Tailwind CSS, Shadcn/UI, Zustand, Recharts, Framer Motion.

**Backend** : FastAPI, Python 3.10+, PostgreSQL/Supabase, SQLAlchemy async.

**Moteur de fairness** : Fairlearn, Scikit-learn, Pandas, NumPy, SciPy, Statsmodels.

**IA** : Google Gemini API pour les recommandations contextualisées.

**Rapports** : ReportLab (PDF), OpenPyXL (Excel).

**Déploiement** : Netlify (frontend), Render + Docker (backend), Supabase (BDD).

## **3.4 Considérations éthiques**

Consentement éclairé des participants. Réponses anonymes. Données non partagées. Le MVP applique le principe de minimisation du RGPD. AuditIQ n'est jamais présenté comme un certificat de conformité -- l'interface le signale explicitement.

## **3.5 Conclusion de la méthodologie**

L'approche mixte assure l'ancrage dans des besoins réels. Le Design Thinking part de l'utilisateur. L'agile permet d'itérer rapidement. Les limites (échantillon modeste, développement solo) sont assumées et discutées dans la conclusion.

# **PARTIE 4 : ANALYSE ET DÉVELOPPEMENT**

## **4.1 Analyse des données collectées**

### **4.1.1 Analyse quantitative : résultats du sondage**

Le sondage (n=34, temps moyen 2 min 35 s) a produit les résultats suivants.

**Profil.** Secteur tech (32,4 %), finance/assurance (20,6 %), santé (11,8 %). Taille : 44,1 % de 250+ salariés, 20,6 % de 10-49, 14,7 % de 50-249, 11,8 % de 1-9.

**Usages IA.** Recrutement (17 %), chatbots (17 %), marketing (14,9 %), scoring (6,4 %), recommandations (6,4 %), aucun (14,9 %), autre (23,4 %). Ce sont des outils banals que beaucoup n'identifient pas comme « systèmes d'IA » au sens de l'AI Act.

**Connaissance des biais.** 38,2 % n'en ont jamais entendu parler. Avec les 20,6 % de connaissance vague, 60 % n'ont pas de compréhension solide. Seuls 23,5 % « connaissent bien ».

> **[FIGURE 9 — Diagramme en barres : Intérêt pour un outil de détection des biais]** Source : Sondage, Q6. Barres horizontales : « Intéressé si simple » 44,1 %, « Moyennement intéressé » 23,5 %, « Très intéressé, besoin urgent » 20,6 %, « Pas intéressé » 11,8 %. Regrouper visuellement les 3 premières barres (intéressés = 88,2 %) vs la dernière (non intéressés = 11,8 %) avec une accolade ou un encadré.

> **[FIGURE 10 — Graphique croisé : Perception du risque vs. Connaissance des biais]** Diagramme à 2 axes : axe X = niveau de connaissance des biais (Q4), axe Y = perception du risque discriminatoire (Q5). Montrer que même les répondants « Non, jamais » perçoivent un risque (44 % répondent « Oui, c'est probable » ou « Peut-être »). Utiliser un scatter plot ou un diagramme en mosaïque. Créer avec Excel ou Python matplotlib.

**Perception du risque.** 44,1 % estiment que leurs outils pourraient discriminer, 26,5 % ne sauraient pas le vérifier. Le croisement révèle un paradoxe : beaucoup soupçonnent un problème qu'ils ne savent pas nommer.

**Intérêt.** 44,1 % intéressés « si simple », 20,6 % « besoin urgent ». La condition « si simple » est un prérequis, pas un bonus.

**Budget.** 35,3 % à 0 euro, 17,6 % sous 500 euros, 29,4 % entre 500-2 000 euros, 5,9 % au-dessus de 2 000 euros. Un audit externe coûte 5 000 à 50 000 euros -- inaccessible pour 82 % de l'échantillon. La version de base doit être gratuite.

**Analyses croisées.** La connaissance augmente avec la taille, mais la perception du risque est plus élevée dans les PME de 10-49 salariés -- plus proches de leurs clients, elles « sentent » le risque. Le secteur finance/assurance exprime l'intérêt le plus fort, sensibilisé par la réglementation existante (ACPR). Les répondants à budget nul sont proportionnellement *plus* intéressés que les autres.

### **4.1.2 Analyse qualitative : enseignements des entretiens**

Cinq thèmes récurrents ont émergé.

**Thème 1 : La confusion IA/automatisation.** Un responsable RH : « De l'IA, nous on n'en fait pas vraiment. On a juste un logiciel qui trie les CV par mots-clés. » Or, selon l'article 3 de l'AI Act, c'est bien un système d'IA.

**Thème 2 : La peur de « ce qu'on pourrait trouver ».** « Si on fait l'audit et qu'on trouve des biais, qu'est-ce qu'on fait ? » -- formulé par trois interlocuteurs. C'est le « dilemme de l'audit » : savoir peut engager la responsabilité. D'où l'intégration de recommandations de remédiation dans AuditIQ (via Gemini).

**Thème 3 : Le besoin de « preuve ».** « De plus en plus de grands comptes nous demandent si on a une politique IA responsable. On n'a rien à leur montrer. » D'où le module de rapports PDF/Excel.

**Thème 4 : L'isolement décisionnel.** « Je suis le seul à décider de ces sujets. Je n'ai personne à qui demander si c'est bien ou pas. » AuditIQ joue le rôle du collègue expert absent.

**Thème 5 : La méfiance envers le « trop technique ».** « On a essayé un outil d'analyse de données. Personne n'a réussi à l'utiliser. On l'a abandonné. » La complexité perçue est un facteur de rejet aussi puissant que la complexité réelle.

### **4.1.3 Synthèse : du diagnostic au cahier des charges**

Les PME ont besoin d'un outil :

* **Accessible sans data science** (44,1 % le conditionnent)
* **Gratuit ou très abordable** (50 %+ ont moins de 500 euros)
* **Capable de produire des rapports formels**
* **Doté de recommandations actionnables**
* **Aligné sur l'AI Act**

## **4.2 Développement du MVP : AuditIQ**

### **4.2.1 Vision produit refondée : un outil de première ligne**

Proposition de valeur : « Détectez et documentez les biais de vos systèmes d'IA en moins d'une heure, sans code, avec un rapport aligné sur l'AI Act et le droit français. »

**Détecter, pas corriger.** Les algorithmes de mitigation existent, mais leur application exige des arbitrages normatifs. J'ai retiré toute mitigation automatique -- elle aurait contredit l'article 14 et aurait été dangereuse pour des non-formés.

**Documenter, comme geste de conformité.** L'article 11 impose une documentation tracée et auditable. Un rapport PDF structuré couvre une part significative de cette obligation.

**Première ligne, pas certificat.** Aucune page ne parle de « certification ». Les rapports rappellent que l'article 43 prévoit une évaluation dépassant le périmètre d'un auto-diagnostic.

Par rapport à Fairlearn/AIF360, AuditIQ apporte une interface graphique, une couche d'interprétation en langage naturel, et un ancrage réglementaire. Par rapport à Fiddler/TruEra, il cible les PME à coût nul. Par rapport à Algorithm Audit et LangBiTe, il offre une solution intégrée couvrant les trois cas d'usage PME.

### **4.2.2 Architecture technique : trois modules sur un socle commun**

> **[FIGURE 11 — Diagramme d'architecture technique d'AuditIQ (version refondue)]**
> *Schéma en couches montrant le socle commun (Next.js frontend, FastAPI backend, Supabase/PostgreSQL, couche d'interprétation, générateur de rapports, Google Gemini pour les explications) et, en colonnes parallèles, les trois modules : (1) Audit supervisé — Fairlearn/Scikit-learn, (2) Détection non supervisée — KMeans + chi2, (3) Audit LLM — banque de prompts paired. Flèche unique de sortie vers le générateur de rapports PDF/Excel. Créer avec draw.io ou Lucidchart.*

Le **frontend** Next.js 16 + TypeScript utilise Shadcn/UI (WCAG 2.1 AA), Zustand pour l'état, Recharts pour les visualisations.

Le **backend** FastAPI expose une API REST documentée (Swagger). Routers thématiques : `audit.py`, `unsupervised.py`, `llm_audit.py`, `reports.py`, `auth.py`. Les routers `ml.py` et `datascience.py` ont été désactivés (hors scope « facilement »).

**PostgreSQL/Supabase** avec Row Level Security. Authentification JWT/OAuth2/Bcrypt, rate limiting SlowAPI, CORS restreint.

**Fairlearn + Scikit-learn + SciPy** portent la logique scientifique. **Google Gemini** produit les explications en langage naturel. **ReportLab** et **OpenPyXL** produisent les rapports. Les trois modules partagent la même couche d'interprétation et le même générateur de rapports.

### **4.2.3 Module 1 — Audit supervisé classique**

Pour les PME disposant de données labellisées. L'utilisateur uploade un CSV avec prédictions, résultats réels, et attribut sensible. Le moteur calcule **Demographic Parity**, **Equal Opportunity**, **Equalized Odds** et **règle des quatre cinquièmes** via la classe `MetricFrame` de Fairlearn.

Les résultats sont traduits en feux tricolores et en langage naturel. Exemple : « Écart de parité : 23 %. Ce niveau dépasse la règle des quatre cinquièmes et pourrait constituer un risque au regard de l'article 10 de l'AI Act, ainsi qu'une présomption de discrimination indirecte au sens de l'article L.1132-1 du Code du travail. »

> **[FIGURE 12 — Capture d'écran : résultats Module 1 dans AuditIQ]**
> *Capture montrant le tableau de bord après un audit supervisé : feux tricolores par métrique, graphique en barres comparant les groupes sur Demographic Parity, Equal Opportunity et règle des quatre cinquièmes, score global, et encart explicatif en langage naturel. Prendre depuis la démo.*

### **4.2.4 Module 2 — Détection non supervisée (nouveau)**

Réponse au **paradoxe de l'article 10(5)** : les PME françaises sont structurellement incapables de collecter les données sensibles nécessaires au Module 1 (RGPD, CNIL, Défenseur des droits). Le Module 2, inspiré d'**Algorithm Audit**, renverse la question : plutôt que de chercher des écarts entre groupes déclarés, on cherche des **clusters de traitement** déviants, puis on les caractérise *a posteriori*.

Pipeline : (1) Standardisation (`StandardScaler` + one-hot). (2) KMeans (k=5 par défaut). (3) Taux de décision positive par cluster. (4) Test du Khi-deux (`scipy.stats.chi2_contingency`, p<0,05 = signal). (5) Identification des clusters déviants (>20 points d'écart). (6) Caractérisation post-hoc : « Ce cluster regroupe des observations dont le code postal commence par 93, l'âge > 45 ans et l'ancienneté < 2 ans. Ces caractéristiques peuvent être des proxies de critères protégés par l'article L.1132-1. » (7) Feu tricolore avec renvoi aux articles 9 et 10.

Ce module **ne requiert aucune donnée sensible au sens du RGPD**. Un cluster déviant n'est pas automatiquement une discrimination -- c'est un signal à approfondir. C'est le module le plus original d'AuditIQ.

> **[FIGURE 13 — Capture d'écran : résultats Module 2 (détection non supervisée)]**
> *Capture montrant la visualisation d'un clustering KMeans, avec les clusters déviants en surbrillance, la p-value du chi2, et la caractérisation post-hoc des clusters déviants par leurs features dominantes.*

### **4.2.5 Module 3 — Audit LLM/chatbot (nouveau)**

Réponse aux **17,6 % de PME utilisant un chatbot** -- sous le coup de l'**article 50** de l'AI Act. Un LLM n'est pas un classifieur binaire ; les métriques tabulaires n'ont pas de sens pour lui.

Inspiré de **LangBiTe** (Morales et al., 2024), le module utilise des **prompts pairés** qui ne diffèrent que par un attribut sensible. Conception : une banque de **10 prompts pairés** bilingues (FR/EN) couvrant six catégories protégées. Un appel HTTP générique compatible avec tout LLM (ChatGPT, Claude, Gemini, Mistral, modèles auto-hébergés).

Trois métriques d'écart : (1) **écart de longueur** de réponse, (2) **écart de sentiment**, (3) **taux de refus**. Score agrégé par catégorie et feu tricolore. Ancrage dans l'article 50 et la doctrine CNIL.

> **[FIGURE 14 — Capture d'écran : résultats Module 3 (audit LLM)]**
> *Capture montrant le tableau de scores par catégorie (genre, origine, âge, religion, handicap, orientation), le feu tricolore global, et deux exemples de paires de prompts les plus divergentes avec les réponses du LLM.*

### **4.2.6 La couche d'interprétation et de traduction**

Trois fonctions partagées par les trois modules :

**Feux tricolores.** Module 1 : seuil à 0,80 (règle des 4/5). Module 2 : p-value < 0,05 + écart > 20 points. Module 3 : seuils inspirés de LangBiTe.

**Explications en langage naturel.** Mécanisme hybride : trame structurée (chiffres, groupes, seuils) mise en forme par **Google Gemini**. Gemini ne génère plus de recommandations libres -- il met en forme un texte pré-calculé, réduisant le risque d'hallucination.

**Ancrage juridique.** Contexte d'emploi : article L.1132-1 + Défenseur des droits. Contexte financier : doctrine ACPR + RGPD. Chatbot : article 50 de l'AI Act.

### **4.2.7 La génération de rapports de conformité**

Rapports PDF (ReportLab) et Excel (OpenPyXL) alignés sur les articles 9, 10 et 11. Contenu : résumé exécutif, résultats par module, visualisations, références au droit français, mise en regard métriques / articles AI Act. Le rapport n'est pas un certificat -- mentionné en première page et en pied de page.

> **[FIGURE 15 — Extrait d'un rapport PDF de conformité (version 3 modules)]**
> *Capture de la page de résumé exécutif (feu tricolore global, synthèse des 3 modules si tous exécutés) et d'une page de détail montrant la mise en regard métrique ↔ article AI Act ↔ référence de droit français.*

### **4.2.8 Choix techniques et arbitrages : ce qui a été retiré**

Quatre fonctionnalités retirées, toutes pour la même raison : elles exigeaient des connaissances techniques incompatibles avec le critère « facilement ».

* **Chatbot assistant IA** : déplaçait l'effort cognitif au lieu de le réduire. Remplacé par un wizard en quatre étapes.
* **Module d'entraînement ML** : supposait de comprendre cross-validation, surajustement, hyperparamètres.
* **Module data science généraliste** : ANOVA, factorielles, matrices de corrélation -- hors scope fairness.
* **Monitoring continu en temps réel** : hors portée d'un MVP solo. Remplacé par un scheduler APScheduler pour audits récurrents.

**Principe non négociable : toute fonctionnalité qui exige un data scientist pour être exploitée contredit la thèse du mémoire.**

## **4.3 Évaluation du prototype**

#### **4.3.1 Protocole d'évaluation utilisateur**

Trois instruments. Le **System Usability Scale (SUS)** (Brooke, 1996) : 10 items, score sur 100 (>68 = supérieur à la moyenne, >80 = excellent). Le ***time-on-task*** : cible de 15 minutes par tâche pour un non-technique, trois tâches types (T1 audit supervisé, T2 non supervisé, T3 audit LLM). Une **comparaison avec Fairlearn CLI** sur un sous-groupe technique.

#### **4.3.2 Échantillon et modalités**

**6 à 8 testeurs** PME, diversifiés par niveau technique, secteur et familiarité avec la fairness. Sessions d'une heure : profil (5 min), présentation (5 min), tâches chronométrées avec think-aloud (30-40 min), SUS (5 min), entretien critique (10 min). Conforme à Nielsen (2000) : 5 utilisateurs révèlent 85 % des problèmes majeurs.

#### **4.3.3 Métriques secondaires et tests automatisés**

Tests automatisés couvrant les calculs des trois modules. **Validation croisée numérique** : chaque métrique du Module 1 vérifiée au 5e chiffre significatif contre Fairlearn CLI.

#### **4.3.4 Limites de l'évaluation**

Trois limites assumées : taille de l'échantillon (pas d'inférence statistique), biais de recrutement (réseau personnel), absence de test longitudinal (listée en 5.3.3).

#### **4.3.5 Conformité et sécurité**

Données non conservées au-delà de la session sauf demande explicite. Rate limiting, CORS restreint, Bcrypt, JWT à expiration. L'outil n'est pas un certificat -- mentionné dans l'interface et sur chaque rapport.

## **4.4 Conclusion de la partie 4**

L'analyse confirme un besoin réel et urgent. Les PME utilisent l'IA dans des contextes à risque, n'ont pas les moyens d'évaluer ces risques, et sont demandeuses d'une solution accessible. AuditIQ traduit ce besoin en plateforme fonctionnelle. Le MVP n'est pas parfait, mais il démontre la viabilité du concept : rendre l'audit de fairness accessible aux non-spécialistes, le relier aux exigences réglementaires, et le proposer à un coût compatible avec les budgets PME.

# **PARTIE 5 : CONCLUSION ET RECOMMANDATIONS**

## **5.1 Synthèse des principaux résultats**

Quatre constats.

**Premier constat : le problème est un problème d'interfaces, pas d'algorithmes.** Les fondements théoriques existent (Mehrabi et al., 2021 ; Chouldechova, 2017 ; Wachter, Mittelstadt et Russell, 2021). Ce qui manque est une **triple interface** reliant simultanément l'univers cognitif des décideurs, l'univers technique des pipelines de calcul, et l'univers juridique des obligations. C'est la contribution principale de ce mémoire.

**Deuxième constat : le fossé empirique est réel mais hétérogène.** 38 % n'avaient jamais entendu parler de biais, 35 % n'avaient aucun budget, mais 44 % soupçonnaient une discrimination, et 17 % utilisaient un chatbot sans en mesurer les risques. La refonte en trois modules répond à ces trois profils distincts.

**Troisième constat : AuditIQ démontre la faisabilité.** La plateforme construit les trois interfaces, pour les trois cas d'usage PME, sur un socle unifié, à coût nul en phase MVP. Les tests garantissent l'équivalence numérique avec Fairlearn CLI.

> **[FIGURE 17 — Schéma de synthèse : la triple interface et la réponse AuditIQ]**
> *Diagramme montrant 3 colonnes : Interface cognitive (38 % ne connaissent pas les biais → AuditIQ : explications en langage naturel, feux tricolores), Interface technique (outils existants requièrent du code → AuditIQ : wizard graphique, trois pipelines unifiés), Interface réglementaire (pas de lien métriques ↔ AI Act → AuditIQ : rapports de conformité ancrés dans le droit français). Flèches reliant chaque interface à la fonctionnalité d'AuditIQ qui la construit. Créer avec PowerPoint ou Canva.*

**Quatrième constat : les limites sont substantielles.** AuditIQ ne couvre qu'environ 15 % des exigences AI Act (articles 10 et 11 principalement). L'échantillon est de n=34 (44 % grandes entreprises). L'évaluation porte sur 6-8 testeurs. Le Module 2 produit un signal, pas une preuve. Le Module 3 repose sur 10 prompts. Ces limites sont les conditions de possibilité d'un projet solo.

La contribution revendiquée : **démontrer qu'une réponse intégrée à la triple lacune est techniquement faisable à coût marginal nul**, et proposer le concept de triple interface comme cadre d'analyse.

## **5.2 Discussion sur les implications des résultats**

### **5.2.1 Implications pratiques**

La démocratisation de l'audit de fairness est techniquement faisable. Le verrou est dans la conception de l'interface, pas dans la technologie. AuditIQ ne réinvente pas Fairlearn, il le rend accessible. Cette logique de « traduction » pourrait inspirer d'autres domaines de conformité.

L'AI Act agit comme catalyseur. Le parallèle avec le RGPD est éclairant : perçu comme contrainte en 2018, il a poussé les entreprises à mieux gérer leurs données.

L'audit de fairness ne peut pas être entièrement automatisé (Chouldechova). Chaque contexte impose des arbitrages normatifs. AuditIQ facilite l'audit, il ne remplace pas le jugement humain.

L'utilisation de Gemini pour la conformité illustre un usage vertueux de l'IA au service de la gouvernance de l'IA, mais soulève la question des biais des recommandations elles-mêmes.

### **5.2.2 Contributions à la littérature**

Trois contributions : (1) documentation empirique des besoins des PME françaises face aux biais IA -- angle peu couvert ; (2) architecture technique concrète d'un outil d'audit PME aligné sur l'AI Act ; (3) concept de « triple interface » comme cadre d'analyse du fossé entre outils existants et besoins non-spécialistes.

## **5.3 Recommandations**

### **5.3.1 Pour les PME**

* **Cartographier ses usages IA** -- certains répondants découvraient pendant le sondage que leur outil de scoring est un « système d'IA ».
* **Évaluer la criticité** selon la distinction haut risque / autres de l'AI Act.
* **Utiliser un outil d'audit, même imparfait** -- un audit partiel vaut mieux que pas d'audit.
* **Documenter sa démarche** -- même sans tout corriger, la trace est un élément de conformité.
* **Profiter des bacs à sable réglementaires** (article 57, dès août 2026) -- gratuits, avec protection contre les amendes.
* **Désigner un référent IA interne** pour centraliser veille et décisions.
* **Former les équipes aux fondamentaux** -- corrélation/causalité, biais de sélection, questionnement critique.

### **5.3.2 Pour les décideurs politiques et les régulateurs**

* **Sensibiliser les PME** -- 38 % ne savent pas ce qu'est un biais algorithmique. Répliquer le modèle des « ateliers RGPD » de la CNIL.
* **Développer des guides sectoriels** -- « comment auditer un tri de CV », « quelles métriques pour le scoring de crédit ».
* **Soutenir financièrement les outils open source** -- à l'image du gouvernement néerlandais avec Algorithm Audit.
* **Créer un label « IA responsable » PME** -- critère dans les marchés publics et relations B2B.

### **5.3.3 Pour les recherches futures**

* **Intégrer AuditIQ aux bacs à sable réglementaires** (article 57) pour élargir la base d'utilisateurs et faire remonter des données aux régulateurs.
* **Étendre le Module 3 aux LLM open-weight auto-hébergés** (vLLM, Ollama) pour la reproductibilité.
* **Adapter l'ancrage juridique à d'autres juridictions** (droit allemand AGG, néerlandais Awgb, etc.) -- tester si seule la troisième interface doit être reconfigurée.
* **Conduire une étude longitudinale** (6 mois à 1 an) sur l'adoption et l'impact réel.
* **Soumettre AuditIQ à un panel juridique** (CNIL, Défenseur des droits, AFNOR) pour valider les formulations réglementaires.

## **5.4 Réflexion personnelle et DevPCP**

### **5.4.1 Évolution de ma compréhension du problème**

Je pensais que les biais étaient un problème technique. Les entretiens m'ont montré que le vrai défi est humain : la peur, l'isolement, le décalage entre littérature et terrain. La lecture de Wachter, Mittelstadt et Russell m'a obligé à repositionner AuditIQ : non pas un juge automatisé, mais un assistant qui aide à poser les bonnes questions. D'où le choix de ne jamais afficher de verdict binaire.

### **5.4.2 Compétences développées**

**Techniques** : full-stack SaaS solo (FastAPI, Next.js, Fairlearn, Docker, JWT/OAuth2). La vraie difficulté : faire fonctionner toutes les briques ensemble.

**Recherche** : enquêtes, analyse thématique (Braun et Clarke), triangulation. Ne pas confondre ce que la littérature dit avec ce qu'on voudrait qu'elle dise.

**Communication** : traduire la fairness pour des non-techniciens. Compétence la plus transférable.

**Gestion de projet solo** : tenir tous les rôles, s'imposer une discipline de planification, apprendre à dire non.

### **5.4.3 Difficultés rencontrées et leçons tirées**

La collecte de données a été la plus grande difficulté. Chaque réponse au sondage a demandé un effort de sollicitation. L'intégration frontend/backend a posé des problèmes de performance et de gestion asynchrone. Le dimensionnement du projet a exigé de renoncer à environ deux tiers des fonctionnalités souhaitées. Chaque « non » a été nécessaire pour livrer un MVP fonctionnel plutôt qu'un prototype inachevé.

### **5.4.4 Dimension collective et perspectives**

Ce travail individuel repose sur un écosystème collectif : Fairlearn, Algorithm Audit, LangBiTe, les 34 répondants. AuditIQ est open source, disponible sur GitHub. Je souhaite explorer une structuration communautaire du projet, à l'image de la Linux Foundation avec Fairlearn.

## **5.5 Conclusion générale**

La question posée n'admet pas de réponse unique. Les biais sont protéiformes, la « facilité » est relative, la conformité est une cible mouvante. Mais ce projet démontre qu'on peut réduire considérablement la distance entre l'état de l'art et la réalité des PME. AuditIQ prouve qu'un outil accessible, abordable et aligné sur l'AI Act peut exister.

La route est encore longue. Les normes ne sont pas finalisées. Les PME doivent être sensibilisées. Des questions de fond restent ouvertes. Mais dans un domaine où 38 % des professionnels n'ont jamais entendu parler de biais algorithmiques, le premier pas compte plus que tous les suivants.

Merci aux 34 répondants, aux personnes interviewées, à mes encadrants, et à la communauté Fairlearn. Ce mémoire est le fruit de leurs contributions autant que du mien.

AuditIQ ne s'arrête pas avec la soutenance. La plateforme est en ligne, le code est ouvert. J'espère qu'elle contribuera à rendre la fairness algorithmique accessible à toutes les entreprises. Parce que derrière chaque algorithme biaisé, il y a des personnes réelles qui subissent des conséquences réelles.

# **LISTE DES FIGURES**

| N° | Titre | Partie |
| ----- | ----- | ----- |
| Figure 1 | Répartition sectorielle des répondants (diagramme circulaire) | Partie 1 |
| Figure 2 | Connaissance des biais algorithmiques (diagramme en barres) | Partie 1 |
| Figure 3 | Budget annuel pour audit éthique IA (barres empilées) | Partie 1 |
| Figure 4 | Pyramide de classification des risques de l'AI Act | Partie 2 |
| Figure 5 | Tableau comparatif des métriques de fairness | Partie 2 |
| Figure 6 | Tableau comparatif des outils de détection des biais | Partie 2 |
| Figure 7 | Design méthodologique séquentiel explicatif (schéma de flux) | Partie 3 |
| Figure 8 | Les 5 phases du Design Thinking appliquées au projet | Partie 3 |
| Figure 9 | Intérêt pour un outil de détection des biais (diagramme en barres) | Partie 4 |
| Figure 10 | Analyse croisée : Perception du risque vs. Connaissance des biais | Partie 4 |
| Figure 11 | Diagramme d'architecture technique d'AuditIQ | Partie 4 |
| Figure 12 | Capture d'écran : Dashboard de fairness AuditIQ | Partie 4 |
| Figure 13 | Capture d'écran : Résultat d'une analyse Auto EDA | Partie 4 |
| Figure 14 | Extrait d'un rapport PDF de conformité généré par AuditIQ | Partie 4 |
| Figure 15 | Parcours utilisateur en 4 étapes (captures wizard) | Partie 4 |
| Figure 16 | Capture d'écran : Recommandations IA générées par AuditIQ | Partie 4 |
| Figure 17 | Schéma de synthèse : le « triple fossé » et la réponse AuditIQ | Partie 5 |

# **BIBLIOGRAPHIE**

## **Textes réglementaires**

* Règlement (UE) 2024/1689 du Parlement européen et du Conseil du 13 juin 2024 établissant des règles harmonisées concernant l'intelligence artificielle (AI Act). *Journal officiel de l'Union européenne*.  
* Commission européenne (2025). *Digital Omnibus Proposal — Proposition de simplification des obligations réglementaires numériques pour les PME*. Bruxelles.  
* Parlement européen (2026, mars). Résolution législative sur le Digital Omnibus — Position en première lecture. 569 voix pour.

## **Articles scientifiques et rapports de recherche**

* Buolamwini, J. & Gebru, T. (2018). Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification. *Proceedings of Machine Learning Research*, 81, 1-15.  
* Chouldechova, A. (2017). Fair prediction with disparate impact: A study of bias in recidivism prediction instruments. *Big Data*, 5(2), 153-163.  
* Kleinberg, J., Mullainathan, S. & Raghavan, M. (2016). Inherent Trade-Offs in the Fair Determination of Risk Scores. *Proceedings of Innovations in Theoretical Computer Science (ITCS)*.  
* Mehrabi, N., Morstatter, F., Saxena, N., Lerman, K. & Galstyan, A. (2021). A Survey on Bias and Fairness in Machine Learning. *ACM Computing Surveys*, 54(6), 1-35.  
* Braun, V. & Clarke, V. (2006). Using thematic analysis in psychology. *Qualitative Research in Psychology*, 3(2), 77-101.  
* Creswell, J.W. & Plano Clark, V.L. (2018). *Designing and Conducting Mixed Methods Research* (3e éd.). Sage Publications.  
* Algorithm Audit (2025). Auditing a Dutch Public Sector Risk Profiling Algorithm Using an Unsupervised Bias Detection Tool. *arXiv:2502.01713*.  
* Urbiola, A., Cabot, J. & Pérez, J. (2025). LangBiTe: An Open-Source Platform to Automate Bias Testing of Large Language Models. *SoftwareX*, Elsevier.  
* Paprocki, M. et al. (2025). From Bias to Accountability: How the EU AI Act Confronts Challenges in European GeoAI Auditing. *arXiv:2505.18236*.  
* Service de recherche du Parlement européen (2025). *Algorithmic Discrimination under the AI Act and the GDPR*. EPRS\_ATA(2025)769509\_EN.  
* Mökander, J. et al. (2025). Artificial Intelligence Bias Auditing: Current Approaches, Challenges and Lessons from Practice. *Review of Accounting and Finance*, Emerald.  
* Metcalf, J. et al. (2025). Auditing the Audits: Lessons for Algorithmic Accountability from Local Law 144's Bias Audits. *ACM FAccT Conference Proceedings*.  
* Ntoutsi, E. et al. (2024). Bias and Ethics of AI Systems Applied in Auditing: A Systematic Review. *ScienceDirect*.  
* Veale, M. & Borgesius, F.Z. (2025). Using Sensitive Data to De-bias AI Systems: Article 10(5) of the EU AI Act. *Computer Law & Security Review*, Elsevier.  
* Edwards, L. & Veale, M. (2025). Standardised Bias? The Role of European Standards Bodies in the AI Act. *Internet Policy Review*.  
* Bertrand, M. & Mullainathan, S. (2004). Are Emily and Greg More Employable Than Lakisha and Jamal? A Field Experiment on Labor Market Discrimination. *American Economic Review*, 94(4), 991-1013.  
* O'Neil, C. (2016). *Weapons of Math Destruction: How Big Data Increases Inequality and Threatens Democracy*. Crown Publishing.  
* Barocas, S. & Selbst, A.D. (2016). Big Data's Disparate Impact. *California Law Review*, 104(3), 671-732.  
* Corbett-Davies, S. & Goel, S. (2018). The Measure and Mismeasure of Fairness: A Critical Review of Fair Machine Learning. *arXiv:1808.00023*.  
* Mitchell, S., Potash, E., Barocas, S., D'Amour, A. & Lum, K. (2021). Algorithmic Fairness: Choices, Assumptions, and Definitions. *Annual Review of Statistics and Its Application*, 8, 141-163.  
* Wachter, S., Mittelstadt, B. & Russell, C. (2021). Why Fairness Cannot Be Automated: Bridging the Gap Between EU Non-Discrimination Law and AI. *Computer Law & Security Review*, 41, 105567.  
* Commission européenne (2024). *Enquête sur l'adoption de l'IA par les PME européennes*. Direction générale des réseaux de communication, du contenu et des technologies.  
* Eurobaromètre spécial (2024). *Attitudes des Européens vis-à-vis de l'intelligence artificielle*. Commission européenne.

## **Ressources en ligne et rapports professionnels**

* Artificial Intelligence Act EU (s.d.). *Small Businesses' Guide to the AI Act*. Disponible sur : [artificialintelligenceact.eu/small-businesses-guide-to-the-ai-act](https://artificialintelligenceact.eu/small-businesses-guide-to-the-ai-act/)  
* Riemenschneider Legal (2025). *EU AI Act for SMEs 2025: What You Must Do Now*. Disponible sur : [riemenschneider.legal/en/eu-ai-act-for-smes-2025](https://riemenschneider.legal/en/eu-ai-act-for-smes-2025/)  
* Berger, M. & Satyanarayan, R. (2025). How SMEs Can Prepare for the EU's AI Regulations. *Harvard Business Review*.  
* Accountancy Europe (2025). *The EU AI Act: A Guide for SME Accountants*. Bruxelles.  
* European Digital SME Alliance (2025). *AI Act Compliance Made Easier: Help Is on Its Way for SMEs Developing AI Solutions*.  
* AI Policy Bulletin (2025). It's Too Hard for Small and Medium-Sized Businesses to Comply with EU AI Act: Here's What to Do.  
* ISACA (2024). A Proposed High-Level Approach to AI Audit. *ISACA Journal*, Volume 2.  
* OECD.AI (2024). *Catalogue of Tools for Trustworthy AI — Unsupervised Bias Detection Tool*. Disponible sur : [oecd.ai/en/catalogue/tools](https://oecd.ai/en/catalogue/tools/)  
* EDPB (2025, janvier). *AI Bias Evaluation*. Comité européen de la protection des données.

## **Outils et frameworks techniques**

* Fairlearn Contributors (s.d.). *Fairlearn: A toolkit for assessing and improving fairness in AI*. Disponible sur : [github.com/fairlearn/fairlearn](https://github.com/fairlearn/fairlearn)  
* IBM Research (s.d.). *AI Fairness 360 (AIF360)*. Disponible sur : [github.com/Trusted-AI/AIF360](https://github.com/Trusted-AI/AIF360)  
* Algorithm Audit (2024-2025). *Unsupervised Bias Detection Tool*. Disponible sur : [algorithmaudit.eu/technical-tools/bdt](https://algorithmaudit.eu/technical-tools/bdt/)  
* SOM Research Lab, UOC (2024-2025). *LangBiTe*. Disponible sur : [github.com/SOM-Research/LangBiTe](https://github.com/SOM-Research/LangBiTe)

# **ANNEXES**

## **Annexe A : Questionnaire du sondage « IA et Éthique dans les PME — Enquête 2025 »**

*Lien vers le formulaire :* [Microsoft Forms — Sondage IA et Éthique PME](https://forms.office.com/Pages/AnalysisPage.aspx?AnalyzerToken=mpb4sGEh833qosb7vYT0mgSBsEhFAogo&id=yrQckGK4KUCTBuXND22fhguwfrtiJ9lCpVsQtTv76iVUOTRLUEFNTzJSUkdJWkdHMldUTlAyRlRNMi4u)

**Q1.** Dans quel secteur évolue votre entreprise ?

* Technologies / Informatique  
* Finance / Assurance  
* Santé / Médical  
* Services aux entreprises  
* Industrie  
* Commerce / Retail  
* RH / Recrutement  
* Autre

**Q2.** Taille de votre entreprise ?

* 1-9 salariés  
* 10-49 salariés  
* 50-249 salariés  
* 250+ salariés  
* Autre

**Q3.** Votre entreprise utilise-t-elle des outils IA pour : (choix multiples)

* Recrutement (tri CV, scoring)  
* Service client (chatbots)  
* Marketing personnalisé  
* Scoring clients  
* Recommandations produits  
* Aucun usage IA  
* Autre

**Q4.** Connaissez-vous les « biais algorithmiques » ?

* Oui, je connais bien  
* J'en ai entendu parler  
* Vaguement  
* Non, jamais

**Q5.** Pensez-vous que vos outils IA pourraient discriminer ?

* Oui, c'est probable  
* Peut-être, je ne sais pas vérifier  
* Non, ils sont neutres  
* Je n'y avais pas pensé  
* Autre

**Q6.** Seriez-vous intéressé par un outil de détection des biais ?

* Très intéressé, besoin urgent  
* Intéressé si simple  
* Moyennement intéressé  
* Pas intéressé

**Q7.** Budget annuel pour audit éthique IA ?

* 0 euros (gratuit uniquement)  
* Moins de 500 euros  
* 500 à 2000 euros  
* Plus de 2000 euros  
* Autre

**Q8.** Accepteriez-vous un entretien de 15 minutes ?

* Oui, contactez-moi  
* Peut-être  
* Non

**Q9.** Si oui : entrez votre mail

*(Réponse libre)*

**Q10.** Nom de votre entreprise

*(Réponse libre)*

## **Annexe B : Résultats chiffrés du sondage (34 répondants)**

| Question | Réponse | Effectif | Pourcentage |
| ----- | ----- | ----- | ----- |
| Secteur | Technologies / Informatique | 11 | 32,4 % |
|  | Finance / Assurance | 7 | 20,6 % |
|  | Autre | 7 | 20,6 % |
|  | Santé / Médical | 4 | 11,8 % |
|  | Services aux entreprises | 3 | 8,8 % |
|  | Industrie | 2 | 5,9 % |
| Taille | 250+ salariés | 15 | 44,1 % |
|  | 10-49 salariés | 7 | 20,6 % |
|  | 50-249 salariés | 5 | 14,7 % |
|  | 1-9 salariés | 4 | 11,8 % |
| Connaissance biais | Non, jamais | 13 | 38,2 % |
|  | Oui, je connais bien | 8 | 23,5 % |
|  | Vaguement | 7 | 20,6 % |
|  | J'en ai entendu parler | 6 | 17,6 % |
| Risque discrimination | Oui, c'est probable | 15 | 44,1 % |
|  | Peut-être, je ne sais pas vérifier | 9 | 26,5 % |
|  | Non, ils sont neutres | 7 | 20,6 % |
|  | Je n'y avais pas pensé | 2 | 5,9 % |
| Intérêt outil | Intéressé si simple | 15 | 44,1 % |
|  | Moyennement intéressé | 8 | 23,5 % |
|  | Très intéressé, besoin urgent | 7 | 20,6 % |
|  | Pas intéressé | 4 | 11,8 % |
| Budget audit | 0 euros | 12 | 35,3 % |
|  | 500 à 2000 euros | 10 | 29,4 % |
|  | Moins de 500 euros | 6 | 17,6 % |
|  | Autre | 4 | 11,8 % |
|  | Plus de 2000 euros | 2 | 5,9 % |

## **Annexe C : AuditIQ — Accès au MVP**

* **Dépôt GitHub :** [github.com/Franck-F/fairness](https://github.com/Franck-F/fairness.git)  
* **Démo en ligne :** [fairness-eight.vercel.app](https://fairness-eight.vercel.app/)

*QR codes à insérer pour la version imprimée.*

## **Annexe D : Stack technique d'AuditIQ**

| Couche | Technologies |
| ----- | ----- |
| Frontend | Next.js 16, TypeScript 5.0, Tailwind CSS v4, Shadcn/UI, Zustand, React Hook Form, Zod, Recharts, Framer Motion, GSAP, Axios |
| Backend | FastAPI 0.115.0, Python 3.10+, SQLAlchemy (Async), Asyncpg, PyJWT, OAuth2, Bcrypt, Slowapi |
| Data Science | Pandas, NumPy, Scikit-learn, Fairlearn, SciPy, Statsmodels |
| IA | Google Gemini API |
| Rapports | ReportLab (PDF), OpenPyXL (Excel) |
| Scheduling | APScheduler |
| Base de données | PostgreSQL via Supabase |
| Déploiement | Netlify (frontend), Render + Docker (backend), Supabase (BDD) |

## **Annexe E : Captures d'écran complémentaires d'AuditIQ**

***\[CAPTURE E.1 — Page d'accueil / Landing page d'AuditIQ\]** Capture pleine page de la landing page montrant la proposition de valeur, les fonctionnalités clés, et le call-to-action.*

***\[CAPTURE E.2 — Écran de connexion / inscription\]** Capture montrant le formulaire d'authentification (login/signup).*

***\[CAPTURE E.3 — Interface d'upload de données\]** Capture montrant la zone de drag & drop pour le fichier CSV, avec les instructions et les formats acceptés.*

***\[CAPTURE E.4 — Configuration de l'audit : sélection des colonnes\]** Capture montrant les dropdowns de sélection : colonne de prédictions, colonne de résultats réels, colonnes d'attributs sensibles.*

***\[CAPTURE E.5 — Résultats détaillés par métrique de fairness\]** Capture montrant le détail d'une métrique (ex : Demographic Parity) avec le graphique en barres par groupe, le feu tricolore, et l'explication en langage naturel.*

***\[CAPTURE E.6 — Interface de gestion des alertes\]** Capture montrant la configuration des alertes : seuils, canaux (email/Slack), fréquence.*

***\[CAPTURE E.7 — Vue Swagger de l'API backend\]** Capture de la documentation automatique FastAPI (Swagger UI) montrant les endpoints disponibles : /api/auth, /api/audits, /api/eda, /api/reports.*

***\[CAPTURE E.8 — Structure du projet sur GitHub\]** Capture de la page GitHub du repository AuditIQ montrant l'arborescence des fichiers, le README, et les statistiques du projet (commits, langages, licence).*

*Note : Toutes les captures sont disponibles en haute résolution. Les données affichées dans les captures sont des données de démonstration, aucune donnée réelle de client n'est présentée.*
