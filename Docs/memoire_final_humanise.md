

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

Je voudrais d'abord remercier mon directeur de mémoire, *\[nom à compléter\]*, pour son accompagnement pendant ce projet. Ils m'ont surtout empêché de me contenter des réponses faciles — et il y en avait beaucoup en cours de route.

Merci aussi à toute l'équipe pédagogique d'Epitech Digital School, et tout particulièrement à Mme Laura Hassan, pour avoir créé un cadre qui laisse de la place à l'initiative. Choisir un sujet ambitieux pour ce Consulting Project n'a pas été évident, et le fait qu'on m'y ait encouragé a vraiment compté.

Merci aux 34 professionnels qui ont pris le temps de répondre à mon sondage. Et plus encore à ceux qui ont accepté de prolonger l'échange lors d'entretiens. Ce mémoire leur doit beaucoup. Sans leur franchise sur leurs pratiques, leurs doutes et leurs attentes, AuditIQ serait resté un exercice technique déconnecté du réel.

Un remerciement particulier à la communauté open source de Fairlearn. Leur travail est le socle technique d'AuditIQ. Pour être franc, construire un outil d'audit de fairness en partant de zéro aurait été irréaliste pour un projet solo. La qualité de leur framework a rendu tout ça possible.

Merci à mes proches pour leur patience, surtout pendant les semaines où le développement du MVP et la rédaction du mémoire se disputaient mes soirées et mes week-ends.

Enfin, merci à tous ceux qui, de près ou de loin, m'ont aidé à affiner ma problématique, à tester mon prototype, ou simplement à garder la motivation quand le projet semblait trop vaste pour une seule personne.

# **RÉSUMÉ**

Les PME françaises se mettent à utiliser l'IA. Les PME, elles, n'ont ni expertise data science, ni budget d'audit, ni outils adaptés pour répondre à ces exigences.

Pour creuser cette question, j'ai mené une enquête mixte. D'abord un sondage auprès de 34 professionnels pour avoir des chiffres. Ensuite des entretiens semi-directifs pour comprendre ce qu'il y a derrière les chiffres. Les deux confirment qu'il existe un fossé énorme entre ce que la loi demande et ce que les PME peuvent réellement faire. En réponse, j'ai conçu et développé **AuditIQ**, une plateforme SaaS qui permet à des non-spécialistes d'auditer la fairness de leurs modèles d'IA. Les résultats sont affichés avec un système de feux tricolores, et l'outil génère des rapports de conformité alignés sur les exigences de l'AI Act — le tout sans avoir à écrire une seule ligne de code.

**Mots-clés :** biais algorithmiques, intelligence artificielle, AI Act, PME, fairness, audit, Fairlearn, conformité réglementaire, SaaS

# **ABSTRACT**

The growing adoption of artificial intelligence by small and medium-sized enterprises (SMEs) raises a critical issue: the detection of algorithmic bias. However, SMEs typically lack the technical expertise, budget, and appropriate tools to meet these requirements.

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

L'intelligence artificielle n'est plus réservée aux géants de la tech. Mais elle s'accompagne d'un angle mort que beaucoup préfèrent ignorer : les biais algorithmiques.

Un algorithme de recrutement qui défavorise systématiquement les candidatures féminines. Un modèle de crédit qui pénalise les habitants de certains quartiers. Un chatbot qui répond plus sèchement lorsqu'il perçoit un prénom à consonance étrangère. Ces scénarios ne relèvent pas de la science-fiction. Ils ont été documentés, parfois avec fracas. Amazon a dû abandonner en 2018 son outil de recrutement automatisé, après avoir constaté qu'il pénalisait les CV contenant le mot « women's ». La même année, l'affaire Apple Card a révélé des disparités d'octroi de crédit entre hommes et femmes sur un produit grand public. Buolamwini et Gebru (2018), dans leur article devenu canonique *Gender Shades*, ont montré que les systèmes commerciaux de reconnaissance faciale atteignaient 99 % d'exactitude pour les hommes blancs, mais seulement 65 % pour les femmes noires. Ces cas concernaient tous des multinationales avec des moyens considérables en ingénierie, en juridique, et en communication de crise. Qu'en est-il des PME ? Elles n'ont ni les moyens d'embaucher un data scientist spécialisé en éthique, ni le temps de s'immerger dans la littérature académique sur la *fairness* algorithmique.

C'est dans ce contexte qu'intervient le règlement européen sur l'intelligence artificielle, plus connu sous le nom d'AI Act. Adopté en 2024 et entré en vigueur le 1er août de cette même année, ce texte impose des obligations concrètes aux entreprises qui développent ou déploient des systèmes d'IA, en particulier ceux qualifiés de « haut risque ». L'article 10 exige une gouvernance rigoureuse des données d'entraînement, incluant l'examen et la correction des biais potentiels. L'article 9 impose un système de gestion des risques couvrant l'ensemble du cycle de vie de l'IA. L'article 11 exige une documentation technique détaillée. L'article 14 prescrit une supervision humaine effective. L'article 15 fixe des exigences d'exactitude, de robustesse et de cybersécurité. L'article 17 impose un système de management de la qualité. L'article 43 organise les procédures d'évaluation de la conformité. Et l'article 50 introduit des obligations de transparence pour les IA génératives et les chatbots en contact direct avec le public.

Cette énumération peut paraître aride, mais elle est importante. AuditIQ adresse une brique précise, mais stratégique : **la détection et la documentation des biais**, soit la couche opérationnelle des articles 10 (qualité des données) et 11 (documentation technique). Le reste — gestion des risques (art. 9), supervision humaine (art. 14), robustesse (art. 15), management qualité (art. 17), évaluation de conformité (art. 43) — relève d'une démarche organisationnelle et juridique plus large. Ce n'est pas un substitut à un audit juridique intégral.

Pour une grande entreprise qui dispose d'un département juridique et d'une équipe data science, ces obligations sont gérables. Pour une PME, c'est une autre histoire. Mon enquête de terrain, menée auprès de 34 professionnels, a confirmé ce que je soupçonnais : 38,2 % des répondants n'avaient jamais entendu parler de biais algorithmiques. 35,3 % ne disposaient d'aucun budget pour un audit éthique de leurs outils IA. Et pourtant, 44,1 % reconnaissaient que leurs systèmes pouvaient potentiellement discriminer. 17,6 % déclaraient déjà utiliser un chatbot grand public — chiffre crucial, sur lequel je reviendrai. Il y a là un décalage frappant entre la conscience du risque et la capacité d'action.

Ma problématique s'articule ainsi :

> **Comment permettre aux PME françaises de détecter facilement les biais de leurs algorithmes IA pour se conformer à l'AI Act européen ?**

Trois mots de cette problématique méritent d'être explicités d'emblée, parce qu'ils orientent toute la suite du travail.

**« Françaises ».** J'ai longtemps hésité à inscrire cette délimitation nationale dans la question. Après tout, l'AI Act est un règlement d'application directe dans les 27 États membres — pourquoi restreindre au cas français ? Mais l'ancrage français a une pertinence substantielle, et j'ai fini par l'assumer. Le droit français superpose à l'AI Act un corpus anti-discrimination préexistant et plus contraignant. L'article L.1132-1 du Code du travail interdit toute discrimination dans l'embauche ou la carrière. La loi du 27 mai 2008 fixe 25 critères protégés. La CNIL encadre strictement la collecte d'attributs sensibles au titre du RGPD. Le Défenseur des droits peut être saisi par tout salarié ou candidat. L'ACPR supervise spécifiquement les algorithmes de scoring dans le secteur financier. Une PME française qui déploie un outil de tri de CV n'est donc pas seulement exposée à l'AI Act : elle est aussi exposée au contentieux prud'homal et à l'action en discrimination, bien avant que les sanctions européennes ne deviennent effectives. Cette superposition crée des contraintes spécifiques — notamment sur la collecte d'attributs sensibles — qu'une approche « européenne générale » ne traite pas. Les ancrages juridiques français d'AuditIQ (références explicites à la CNIL, au Code du travail, au Défenseur des droits) sont la conséquence directe de ce choix.

**« Facilement ».** La facilité n'est pas l'absence d'effort. Comme ça, l'affirmation de « facilité » reposera sur des données et non sur une intuition.

**« Détecter ».** Détecter n'est pas corriger, et ce n'est pas certifier. Aucun verdict binaire « conforme / non conforme » n'est jamais affiché, nulle part.

Pour répondre à cette problématique, j'ai choisi la voie du mémoire de projet. Plutôt que de rester dans l'analyse théorique, j'ai voulu aller jusqu'au bout de la démarche en concevant un MVP fonctionnel : **AuditIQ**.

La refonte de scope qu'a connue le projet mérite d'être signalée dès l'introduction, par honnêteté intellectuelle. Le MVP livré repose désormais sur **trois piliers complémentaires**, pensés pour couvrir les trois profils de PME identifiés dans mon enquête.

1. **Un audit supervisé classique** (Module 1), pour les PME qui disposent déjà d'un jeu de données labellisé avec une variable cible et au moins un attribut sensible. C'est le profil typique des structures financières ou RH matures. Ce module s'appuie sur Fairlearn et propose les métriques de référence (Demographic Parity, Equal Opportunity, Equalized Odds, règle des quatre cinquièmes), traduites via un système de feux tricolores et de langage naturel.
2. **Une détection non supervisée** (Module 2), pour les PME qui n'ont pas — ou ne peuvent pas légalement collecter — d'attributs sensibles. C'est le cas majoritaire. Et c'est précisément ce que l'article 10(5) de l'AI Act désigne comme le paradoxe de la fairness : on ne peut pas auditer ce qu'on n'a pas le droit de mesurer. Ce module, inspiré des travaux d'Algorithm Audit (2024), s'appuie sur un pipeline de clustering (KMeans), un test du Khi-deux pour identifier les clusters où les taux de décision positive dévient significativement, et une caractérisation post-hoc par les features dominantes.
3. **Un audit LLM / chatbot** (Module 3), pour les 17 % de PME de mon échantillon qui déclarent déjà utiliser un chatbot. Ce module, directement inspiré du projet LangBiTe (Morales et al., 2024), repose sur une banque de 10 prompts pairés en français et en anglais. Elle couvre le genre, l'origine, l'âge, la religion, le handicap et l'orientation. L'outil mesure les écarts de longueur de réponse, de sentiment et de taux de refus, puis agrège ces signaux en un score par catégorie.

Le mémoire s'organise en cinq parties. La cinquième tire les conclusions du travail, en assumant explicitement ses limites, et formule des recommandations.

Mon objectif n'est pas de prétendre résoudre définitivement le problème des biais algorithmiques. La fairness est, par nature, un concept sociotechnique qui ne se réduit pas à une métrique unique. Chouldechova (2017) l'a démontré mathématiquement en établissant l'incompatibilité entre plusieurs définitions de fairness dès lors que les taux de base diffèrent entre groupes. Wachter, Mittelstadt et Russell (2021) ont prolongé ce constat en soulignant que tout choix de métrique est un choix normatif qui engage une conception de la justice. Mon ambition est plus modeste, et j'espère plus utile : réduire drastiquement la barrière d'entrée pour les PME françaises, en leur offrant un outil qui traduit des concepts complexes en actions concrètes, et qui les aide à poser les bonnes questions — pas à y répondre à leur place.

# **PARTIE 1 : DÉFINITION DU PROBLÈME**

## **1.1 Identification du problème**

Quand on parle de biais algorithmiques, on pense souvent aux cas spectaculaires. Mais ils donnent aussi l'impression que les biais algorithmiques sont un problème de grandes organisations, de systèmes sophistiqués, de contextes extraordinaires.

La réalité est plus banale, et c'est justement ce qui la rend préoccupante. Tous ces acteurs manipulent des systèmes susceptibles de produire des décisions discriminatoires — souvent sans le savoir, et presque toujours sans les moyens de le vérifier.

Le problème que ce mémoire adresse se situe à l'intersection de trois constats.

**Premier constat : les PME adoptent l'IA sans évaluer ses risques éthiques.** L'enquête que j'ai conduite auprès de 34 professionnels le confirme. Parmi les répondants, 17 % utilisent l'IA pour le recrutement (tri de CV, scoring), 17 % pour le service client (chatbots), et 14,9 % pour le marketing personnalisé. Ces usages sont exactement ceux que l'AI Act identifie comme potentiellement « haut risque », en particulier le recrutement et le scoring. Or, 38,2 % de ces mêmes répondants déclarent n'avoir jamais entendu parler de biais algorithmiques. Et parmi ceux qui en ont conscience, 26,5 % avouent ne pas savoir comment vérifier si leurs outils discriminent.

***\[Figure 1 : Répartition sectorielle des répondants\]** Source : Sondage « IA et Éthique dans les PME — Enquête 2025 », 34 répondants.*

![][image1]

***\[Figure 2 : Connaissance des biais algorithmiques\]** Source : Sondage, Q4.* 

**Deuxième constat : le cadre réglementaire se durcit, mais les PME ne sont pas prêtes.** L'AI Act européen, entré en vigueur en août 2024, impose des obligations significatives aux fournisseurs et déployeurs de systèmes d'IA à haut risque. Ces obligations ne font pas de distinction selon la taille de l'entreprise : une PME qui déploie un système de scoring RH est soumise aux mêmes exigences fondamentales qu'un grand groupe. Certes, le règlement prévoit des mesures d'allégement. Systèmes de gestion de la qualité simplifiés (**article 17**), bacs à sable réglementaires avec accès prioritaire (**article 57**), frais de conformité réduits. Et le Digital Omnibus Proposal, adopté par le Parlement européen en mars 2026, propose de repousser certaines échéances à décembre 2027 et de réduire la charge administrative de 35 % pour les PME d'ici 2029.

Mais ces allégements ne changent pas le fond du problème. Ce ratio est tout simplement irréaliste pour la plupart des petites structures.

Mon sondage confirme cette tension, et les chiffres sont parlants. 35,3 % des répondants déclarent un budget de 0 euro pour l'audit éthique de leurs outils IA. Si on ajoute les 17,6 % qui disposent de moins de 500 euros, ça fait plus de la moitié de l'échantillon qui n'a quasiment aucune marge financière pour se mettre en conformité sur le volet fairness. Seuls 5,9 % disposent de plus de 2 000 euros — un montant qui reste modeste au regard du coût d'un audit externe par un cabinet spécialisé.

***\[Figure 3 : Budget annuel pour audit éthique IA\]** Source : Sondage, Q7.* 

**Troisième constat : les outils existants ne répondent pas aux besoins des PME.** Il existe aujourd'hui plusieurs frameworks open source de détection des biais. Ce niveau de compétence est rarement disponible dans une PME de 20 ou 50 salariés.

Et puis il y a un autre angle. Aucun de ces outils ne propose nativement de lien avec les exigences spécifiques de l'AI Act. Un dirigeant de PME qui cherche à vérifier si son système de recrutement est conforme à l'article 10 ne trouvera pas de bouton « Générer un rapport de conformité AI Act » dans Fairlearn. Il devra lui-même faire le pont entre les métriques techniques et les obligations réglementaires. Un exercice qui demande une double expertise, juridique et technique, que les PME n'ont généralement pas.

Des solutions commerciales existent aussi — Fiddler AI, TruEra (acquis par Snowflake en 2025), Holistic AI — mais elles ciblent les entreprises de taille intermédiaire à grande et pratiquent des tarifs incompatibles avec les budgets des PME.

## **1.2 Pertinence du problème**

La pertinence de cette problématique tient à la convergence de plusieurs dynamiques. Je les analyse ici en les croisant avec les données de mon enquête.

**Dynamique réglementaire : une pression inédite.** L'AI Act n'est pas un texte prospectif ou une déclaration d'intention. C'est un règlement en vigueur, directement applicable dans les 27 États membres, avec des échéances concrètes et des sanctions potentiellement lourdes. Les amendes peuvent atteindre 35 millions d'euros ou 7 % du chiffre d'affaires mondial pour les infractions les plus graves (**article 99**). Même les infractions moins sévères, comme le non-respect des obligations de documentation, peuvent entraîner des amendes allant jusqu'à 15 millions d'euros ou 3 % du chiffre d'affaires.

Pour donner un ordre de grandeur : une PME réalisant un chiffre d'affaires de 5 millions d'euros peut, en théorie, se voir infliger une amende de 150 000 euros. L'affaire Uber aux Pays-Bas, où un tribunal a statué en 2023 que l'algorithme de la plateforme discriminait certains chauffeurs, illustre à quel point ces sujets sont devenus judiciarisés.

Le calendrier d'application de l'AI Act mérite d'être rappelé pour comprendre l'urgence. Autrement dit, nous sommes d'ores et déjà dans la fenêtre d'application.

**Dynamique de marché : une adoption accélérée et souvent inconsciente.** L'adoption de l'IA par les PME s'accélère à un rythme que peu d'observateurs avaient anticipé. Les outils no-code et low-code — Zapier, Make, les intégrations IA de Salesforce ou HubSpot — rendent l'IA accessible à des entreprises qui, il y a cinq ans, n'auraient pas eu les ressources techniques pour en déployer.

Mon sondage reflète cette tendance : 85 % des répondants déclarent utiliser l'IA sous une forme ou une autre. Mais cette adoption s'accompagne rarement d'une évaluation des risques. La catégorie « Autre » (23,4 % des usages déclarés) est particulièrement révélatrice. Elle regroupe probablement des outils d'IA intégrés à des logiciels métiers (CRM, ERP, outils comptables) que les utilisateurs ne perçoivent même pas comme de l'intelligence artificielle. Un directeur commercial qui utilise le scoring prédictif de son CRM pour prioriser ses prospects ne réalise pas nécessairement qu'il s'appuie sur un système de machine learning susceptible de reproduire les biais contenus dans ses données historiques de vente.

Cette « invisibilité » de l'IA dans les processus métier est un facteur de risque majeur. Elle augmente mécaniquement le nombre de systèmes potentiellement biaisés en production, sans que les garde-fous éthiques suivent le même rythme. Et elle complique la cartographie des systèmes IA que l'article 9 de l'AI Act impose comme première étape de la gestion des risques.

**Dynamique sociale : une exigence croissante de transparence.** Les consommateurs, les candidats et les citoyens sont de plus en plus sensibles à la question de l'équité algorithmique. Plusieurs contentieux ont porté sur le caractère discriminatoire d'algorithmes de scoring ou de profilage.

Pour les PME, qui dépendent souvent davantage de la proximité et de la confiance de leurs clients que les grandes entreprises, cette dimension est critique. Un cabinet de recrutement de vingt personnes ne survivra probablement pas à une accusation de discrimination algorithmique relayée sur LinkedIn.

**Dynamique concurrentielle : la fairness comme avantage.** Il y a un angle que la littérature traite insuffisamment : la fairness algorithmique n'est pas seulement une contrainte réglementaire, c'est potentiellement un avantage concurrentiel. Se conformer en avance de phase, plutôt que sous la pression d'une échéance, transforme la contrainte en signal de qualité.

Le problème n'est donc pas seulement technique ou juridique : il est stratégique. Et les solutions actuelles ne lui permettent pas de s'en prémunir de manière autonome et accessible.

## **1.3 Objectifs du projet**

Face à ce constat, les objectifs de ce Consulting Project sont les suivants. Je les ai définis selon la méthode SMART pour qu'ils soient opérationnels et vérifiables.

**Objectif 1 — Comprendre les besoins et les freins des PME en matière de détection des biais IA.** Cet objectif passe par une enquête quantitative (sondage auprès d'un minimum de 30 professionnels) et qualitative (entretiens semi-directifs). Échéance : premier trimestre 2025.

**Objectif 2 — Concevoir et développer un MVP fonctionnel répondant aux besoins identifiés.** Le MVP, baptisé AuditIQ, doit permettre à un utilisateur non technique d'auditer la fairness d'un modèle d'IA, de visualiser les résultats, et de générer un rapport aligné sur les exigences de l'AI Act. Échéance : fin du premier semestre 2025.

**Objectif 3 — Évaluer l'utilisabilité et la pertinence du MVP.** Cet objectif implique des sessions de test avec des utilisateurs cibles et la collecte de retours structurés. Échéance : avant la soutenance.

**Objectif 4 — Formuler des recommandations actionnables pour les PME et les décideurs.** Au-delà de l'outil lui-même, ce mémoire vise à produire un ensemble de recommandations pratiques que les PME peuvent appliquer pour améliorer la fairness de leurs systèmes d'IA, avec ou sans AuditIQ. L'indicateur de réussite est la production d'un guide de recommandations intégré à la conclusion du mémoire.

Le problème posé par ce mémoire n'est pas un exercice académique déconnecté du réel. La suite de ce travail cherche à apporter une réponse à la hauteur de cet enjeu.

# **PARTIE 2 : REVUE DE LITTÉRATURE**

## **2.1 Les biais algorithmiques : de quoi parle-t-on ?**

### **2.1.1 Définition et origines**

Le terme « biais algorithmique » recouvre des réalités très différentes selon le champ disciplinaire qui l'emploie. En sciences sociales et en droit, le terme renvoie plutôt à une forme de discrimination : un traitement différencié et injustifié de groupes de personnes sur la base de caractéristiques protégées (genre, origine ethnique, âge, handicap, religion).

Dans le contexte de l'intelligence artificielle, les deux acceptions se rejoignent. Cette variation peut avoir des origines multiples, que la littérature a progressivement identifiées et catégorisées.

Mehrabi et al. (2021) ont proposé une taxonomie qui distingue plus de vingt types de biais dans les systèmes d'IA. Ils les regroupent en trois grandes familles. Les **biais de données** proviennent des jeux de données utilisés pour entraîner les modèles : sous-représentation de certains groupes, étiquetage reflétant des préjugés humains, données historiques encodant des inégalités structurelles. Les **biais algorithmiques** au sens strict résultent des choix de modélisation : fonction objectif qui optimise une métrique globale au détriment de sous-groupes, architecture du modèle qui amplifie certaines corrélations. Les **biais d'interaction** émergent en déploiement, lorsque les retours utilisateurs alimentent une boucle de rétroaction qui renforce les inégalités initiales.

Une revue systématique récente publiée dans ScienceDirect (2024) identifie cinq sources primaires de biais dans les systèmes d'IA appliqués à l'audit. Un développeur qui choisit ses variables, définit ses classes, et sélectionne ses métriques d'évaluation injecte inévitablement ses propres cadres de pensée dans le système.

### **2.1.2 Typologies de préjudices**

La documentation de Fairlearn, le framework de Microsoft pour l'évaluation de la fairness, distingue deux grandes catégories de préjudices liés aux biais algorithmiques.

Les **préjudices d'allocation** surviennent lorsqu'un système d'IA refuse ou accorde de manière inéquitable des opportunités, des ressources ou de l'information. Pareil pour un algorithme de recrutement qui filtre disproportionnellement les CV portant des noms à consonance étrangère.

Les **préjudices de qualité de service** se manifestent lorsqu'un système fonctionne moins bien pour certains groupes que pour d'autres, même si tous y ont théoriquement accès. L'exemple le plus documenté est celui de la reconnaissance faciale : les travaux de Buolamwini et Gebru (2018), dans leur étude fondatrice *Gender Shades*, ont montré que les systèmes commerciaux de classification de genre présentaient un taux d'erreur de 34,7 % pour les femmes à la peau foncée, contre 0,8 % pour les hommes à la peau claire.

Cette distinction est fondamentale pour les PME, parce qu'elle détermine la nature du risque auquel elles s'exposent. Une PME qui utilise l'IA pour le recrutement est exposée à des préjudices d'allocation — potentiellement constitutifs de discrimination au sens du droit du travail français (articles L.1132-1 et suivants du Code du travail) et du droit européen (directive 2000/78/CE). Une PME qui utilise un chatbot est plutôt exposée à des préjudices de qualité de service — moins graves juridiquement, mais dommageables pour la relation client. Et potentiellement constitutifs de discrimination dans l'accès aux services si le chatbot sert de point d'entrée exclusif.

Il existe aussi une troisième catégorie, moins formalisée dans la littérature mais que j'ai observée dans mes entretiens : les **préjudices de représentation**. Pour une PME soucieuse de son image, ce type de biais peut être dommageable même s'il n'est pas directement sanctionné par l'AI Act.

### **2.1.3 Cas concrets de biais dans des contextes PME**

Avant d'aborder les métriques, il me semble utile d'ancrer la discussion dans des exemples concrets, plus proches de la réalité des PME que les cas Amazon ou COMPAS souvent cités.

**Le scoring de crédit dans les fintechs.** Les néo-banques et les fintechs de prêt, souvent des PME en forte croissance, utilisent des modèles de machine learning pour évaluer la solvabilité des demandeurs. Un modèle qui utilise le code postal comme feature prédictive peut, sans le vouloir, reproduire des pratiques de *redlining* — une forme de discrimination géographique historiquement documentée dans le secteur bancaire américain, mais dont les mécanismes existent aussi en Europe.

**Le tri de CV dans les cabinets de recrutement.** Un cabinet de recrutement de taille modeste qui utilise un outil de présélection automatisée des CV s'expose à des biais multiples. Si l'outil est entraîné sur les embauches passées de ses clients, il apprendra à reproduire les biais de ces clients. Y compris les préférences implicites pour certains profils (écoles, quartiers, prénoms). L'étude de Bertrand et Mullainathan (2004) sur la discrimination à l'embauche basée sur le prénom reste tristement actuelle : les CV portant des prénoms à consonance maghrébine reçoivent en France 25 à 40 % de réponses en moins que des CV strictement identiques portant des prénoms à consonance française. Un outil d'IA entraîné sur ces données reproduira mécaniquement cette discrimination.

**Les chatbots de service client.** Une PME du secteur de l'assurance qui déploie un chatbot pour gérer les demandes de ses assurés peut se retrouver avec un système qui comprend moins bien certains accents, certaines formulations, ou certains dialectes régionaux. Ce qui peut créer des disparités de qualité de service pour les locuteurs de français non standard.

### **2.1.4 Métriques de fairness : un champ en tension**

L'un des aspects les plus déroutants de la littérature sur les biais algorithmiques — y compris pour les spécialistes — est la multiplicité des métriques de fairness et l'impossibilité mathématique de les satisfaire toutes simultanément. J'ai mis du temps à comprendre que cette tension n'était pas un problème de clarté de la littérature, mais une propriété mathématique du problème lui-même.

Le **Demographic Parity** (ou parité statistique) exige que la proportion de résultats positifs soit la même dans tous les groupes démographiques. Si les deux groupes ont des taux de qualification différents (par exemple parce que l'accès à la formation est lui-même inégal), forcer la parité statistique peut aboutir à sélectionner des candidats moins qualifiés dans un groupe et à rejeter des candidats plus qualifiés dans l'autre.

L'**Equal Opportunity** (égalité des chances) est plus nuancée : elle exige que le taux de vrais positifs soit identique entre les groupes. Autrement dit, parmi les individus qui méritent un résultat positif (candidats réellement qualifiés, emprunteurs réellement solvables), la probabilité d'être correctement identifié doit être la même quel que soit le groupe d'appartenance.

Les **Equalized Odds** (cotes égalisées) vont plus loin en exigeant l'égalité des taux de vrais positifs *et* de faux positifs entre les groupes. C'est la métrique la plus exigeante, et aussi la plus difficile à atteindre en pratique.

La **règle des quatre cinquièmes** (*four-fifths rule*), issue du droit du travail américain, offre un seuil pragmatique : le taux de sélection du groupe le moins favorisé ne doit pas être inférieur à 80 % du taux de sélection du groupe le plus favorisé. C'est une métrique moins formellement rigoureuse, mais qui a l'avantage d'être ancrée dans la pratique juridique et d'offrir un critère de décision clair.

Le résultat d'impossibilité de Chouldechova (2017) et celui de Kleinberg, Mullainathan et Raghavan (2016) ont démontré mathématiquement qu'il est impossible, sauf dans des cas dégénérés, de satisfaire simultanément le Demographic Parity, l'Equal Opportunity et les Equalized Odds. Ce résultat a des conséquences profondes. Il signifie que tout choix de métrique de fairness est, en dernière instance, un choix normatif, pas seulement technique. Décider que son algorithme doit respecter le Demographic Parity plutôt que l'Equal Opportunity, c'est prendre position sur ce que signifie « être juste » dans un contexte donné.

Pour les PME, cette complexité est à la fois un obstacle et un argument en faveur d'outils comme AuditIQ. Elles ont besoin d'être guidées dans le choix des métriques pertinentes pour leur cas d'usage, et non pas simplement exposées à un catalogue de formules statistiques.

> **[FIGURE 5 — Tableau comparatif des métriques de fairness]** Tableau synthétique à 5 colonnes : Métrique | Définition simplifiée | Ce qu'elle mesure | Quand l'utiliser | Limite principale. Lignes : Demographic Parity, Equal Opportunity, Equalized Odds, Règle des 4/5. Utiliser un code couleur par complexité (vert = simple, orange = intermédiaire, rouge = avancé). Créer dans Word ou Excel.

Wachter, Mittelstadt et Russell (2021) vont encore plus loin dans leur article « Why Fairness Cannot Be Automated ». Ils montrent que les définitions techniques de la fairness utilisées en machine learning ne correspondent pas aux définitions juridiques de la non-discrimination dans le droit européen. Le droit européen distingue la discrimination directe (fondée explicitement sur un critère protégé) de la discrimination indirecte (une pratique apparemment neutre qui produit un désavantage disproportionné pour un groupe protégé). Or, la plupart des métriques de fairness ne captent que la discrimination directe. Un modèle qui n'utilise pas le genre comme variable peut néanmoins produire une discrimination indirecte via des proxies : le temps partiel, le secteur d'activité, la taille des caractères sur le CV.

Ce décalage entre fairness computationnelle et non-discrimination juridique est un angle mort de la plupart des outils existants. Mais la résolution complète de ce problème nécessiterait une collaboration plus étroite entre juristes et data scientists — une direction de recherche que je recommande dans la conclusion.

### **2.1.5 Le débat philosophique : quelle justice pour les algorithmes ?**

Au-delà des métriques et des formalismes, la question des biais algorithmiques renvoie à un débat philosophique de fond sur la justice distributive. Les métriques de fairness encodent, souvent implicitement, des conceptions différentes de la justice.

Le Demographic Parity s'inscrit dans une vision de la justice comme égalité des résultats, proche de la tradition rawlsienne : une société juste est une société où les bénéfices et les charges sont répartis équitablement entre les groupes, indépendamment des différences individuelles. Les individus qui méritent un résultat positif doivent avoir la même probabilité de l'obtenir, quel que soit leur groupe d'appartenance.

Le choix entre ces métriques n'est donc pas un choix technique — c'est un choix de société. Les organismes de normalisation (CEN/CENELEC) tentent de combler ce vide, mais leurs travaux avancent lentement et leurs décisions sont rarement soumises au débat public.

Pour les PME, cette dimension philosophique peut sembler lointaine. Ils reflètent des valeurs différentes.

AuditIQ présente cette nuance à l'utilisateur en expliquant en langage clair ce que chaque métrique mesure et implique, sans imposer un choix par défaut. C'est une position délibérément modeste : l'outil éclaire le choix, il ne le fait pas à la place de l'utilisateur.

## **2.2 Le cadre réglementaire : l'AI Act européen**

### **2.2.1 Genèse et architecture du règlement**

L'AI Act (Règlement UE 2024/1689) est le premier cadre juridique au monde dédié spécifiquement à la régulation de l'intelligence artificielle. On peut le comparer, dans sa portée, au RGPD pour la protection des données ou au Digital Services Act pour les plateformes numériques.

La genèse de ce texte remonte au livre blanc de la Commission européenne sur l'IA, publié en février 2020, qui posait les bases d'une approche européenne fondée sur la confiance et l'excellence. L'accord politique a été trouvé en décembre 2023, et le texte final adopté en mars 2024.

> **[FIGURE 4 — Pyramide de classification des risques de l'AI Act]** Schéma pyramidal à 4 niveaux : base = Risque minimal (aucune obligation), puis Risque limité (obligations de transparence), puis Haut risque (obligations complètes : articles 9-15), sommet = Pratiques interdites (article 5). Indiquer les exemples pertinents PME à chaque niveau. Colorier du vert (bas) au rouge (haut). Utiliser PowerPoint ou draw.io.

Le règlement repose sur une approche fondée sur le risque, qui classe les systèmes d'IA en quatre catégories. Les **systèmes interdits** (article 5) incluent les pratiques de manipulation subliminale, l'exploitation des vulnérabilités de groupes spécifiques, la notation sociale par les autorités publiques, et certaines formes de surveillance biométrique en temps réel dans l'espace public. Les **systèmes à haut risque** (articles 6 à 51) font l'objet d'obligations substantielles de conformité : c'est dans cette catégorie que se retrouvent la plupart des cas d'usage pertinents pour les PME (recrutement, scoring de crédit, accès aux services essentiels). Les **systèmes à risque limité** sont soumis à des obligations de transparence — l'utilisateur doit être informé qu'il interagit avec un système d'IA. Et les **systèmes à risque minimal** (la grande majorité des systèmes d'IA) ne font l'objet d'aucune obligation spécifique, même si les fournisseurs sont encouragés à adopter des codes de conduite volontaires.

L'annexe III du règlement liste les domaines dans lesquels un système d'IA est présumé à haut risque : l'emploi et la gestion des travailleurs (recrutement, promotion, licenciement), l'accès aux services essentiels (crédit, assurance, services publics), l'éducation et la formation professionnelle (admission, évaluation), la migration et le contrôle aux frontières, l'administration de la justice, et les infrastructures critiques. Et mon sondage montre que 34 % des répondants utilisent l'IA pour le recrutement ou le scoring — des cas d'usage directement visés par l'annexe III.

### **2.2.2 Les obligations en matière de biais et de fairness**

Deux articles de l'AI Act sont particulièrement pertinents pour la question des biais algorithmiques.

**L'article 9** impose aux fournisseurs de systèmes d'IA à haut risque de mettre en place un système de gestion des risques continu et itératif, couvrant l'ensemble du cycle de vie du système. Ce système doit identifier et analyser les risques prévisibles pour la santé, la sécurité et les droits fondamentaux — y compris les risques de discrimination. Il doit évaluer ces risques, estimer leur probabilité et leur gravité, et adopter des mesures ciblées de réduction. Une attention particulière doit être portée aux impacts sur les personnes de moins de 18 ans et les groupes vulnérables.

**L'article 10** traite spécifiquement de la gouvernance des données. Il exige que les jeux de données d'entraînement, de validation et de test soient pertinents, suffisamment représentatifs, et aussi exempts d'erreurs que possible. Surtout, il impose explicitement d'examiner les biais possibles dans ces jeux de données et de prendre des mesures appropriées pour les détecter, les prévenir et les atténuer. Le paragraphe 5 de cet article introduit une disposition remarquable : les fournisseurs peuvent exceptionnellement traiter des catégories spéciales de données personnelles (origine ethnique, opinions politiques, orientation sexuelle, etc.) dans le seul but de détecter et corriger les biais, sous réserve de garanties appropriées.

Cette disposition est notable parce qu'elle crée une tension productive avec le RGPD, qui interdit en principe le traitement de ces données sensibles. Un article récent de ScienceDirect (2025) analyse en détail les conditions dans lesquelles cette exception peut être invoquée et les garde-fous nécessaires.

**L'article 15** complète le dispositif en exigeant des niveaux appropriés d'exactitude, de robustesse et de cybersécurité, avec des métriques déclarées dans les instructions d'utilisation.

**Les articles 11 et 12** imposent respectivement des obligations de documentation technique et de tenue de registres (*logging*). L'article 11 exige une documentation technique suffisamment détaillée pour permettre aux autorités compétentes d'évaluer la conformité du système. Cette documentation doit inclure une description des données d'entraînement, des choix de conception, des métriques de performance, et — c'est le point clé pour notre sujet — des mesures prises en matière de fairness et de non-discrimination. L'article 12 impose que les systèmes à haut risque soient conçus pour enregistrer automatiquement les événements pertinents (logs), afin de permettre un audit a posteriori. Pour une PME, ces obligations de traçabilité sont lourdes, parce qu'elles exigent non seulement de faire les choses correctement, mais aussi de pouvoir prouver qu'on les a faites.

**L'article 14** introduit l'obligation de supervision humaine. Les systèmes d'IA à haut risque doivent être conçus pour être effectivement supervisés par des personnes physiques pendant leur utilisation. Cette exigence a des implications directes pour les PME qui utilisent l'IA de manière « *fire and forget* » — un modèle de scoring qui tourne en arrière-plan sans qu'aucun humain ne vérifie jamais ses décisions ne satisfait pas aux exigences de l'article 14. AuditIQ, en permettant un audit régulier et accessible des résultats, contribue indirectement à cette obligation de supervision.

L'ensemble de ces articles dessine un cadre complet, exigeant et cohérent. Mais sa complexité même pose un défi d'appropriation pour les PME, qui doivent naviguer entre des obligations techniques (articles 10 et 15), organisationnelles (articles 9 et 17), documentaires (articles 11 et 12), et de gouvernance humaine (article 14).

### **2.2.3 Les PME face à l'AI Act : entre obligations et allégements**

Le règlement contient plusieurs dispositions destinées à atténuer le poids de la conformité pour les petites structures.

L'article 17, dans sa version amendée, étend aux PME (et non plus aux seules micro-entreprises) la possibilité d'adopter des systèmes de gestion de la qualité simplifiés. L'article 57 impose à chaque État membre de mettre en place au moins un bac à sable réglementaire d'ici août 2026, avec un accès prioritaire et gratuit pour les PME et les startups. Les participants qui suivent de bonne foi les orientations reçues dans le bac à sable sont protégés contre les amendes administratives.

Le Digital Omnibus Proposal, présenté par la Commission européenne en novembre 2025 et adopté par le Parlement en mars 2026 (569 voix pour), va plus loin. Ce texte est actuellement en trilogue entre le Parlement et le Conseil.

### **2.2.4 Standards et normes techniques**

Le CEN/CENELEC Joint Technical Committee 21, chargé de développer les normes harmonisées de l'AI Act, a approuvé deux standards pertinents pour la détection des biais : le CEN/CLC/TR 18115:2024 sur la gouvernance et la qualité des données pour l'IA, et l'ISO/IEC TS 12791:2024 sur le traitement des biais indésirables dans les tâches de classification et de régression par apprentissage automatique.

## **2.3 L'écosystème des outils de détection des biais**

### **2.3.1 Les frameworks open source**

Le paysage des outils open source de détection des biais s'est considérablement enrichi depuis 2018. Trois frameworks dominent.

**Fairlearn**, développé sous l'égide de Microsoft et maintenu par la communauté open source sous la Linux Foundation, est probablement l'outil le plus accessible pour les data scientists travaillant avec Scikit-learn. En quelques lignes de code, un développeur peut obtenir un tableau comparatif montrant comment son modèle performe pour chaque sous-population.

Au-delà de l'évaluation, Fairlearn propose six algorithmes de mitigation couvrant les trois phases du pipeline de machine learning. En post-traitement, le `ThresholdOptimizer` dérive des seuils de décision spécifiques à chaque groupe pour imposer le Demographic Parity ou les Equalized Odds sans retrainer le modèle.

**AI Fairness 360 (AIF360)**, développé par IBM Research, est plus exhaustif mais aussi plus complexe. La documentation est dense, les API sont parfois peu intuitives, et la courbe d'apprentissage est significativement plus raide que celle de Fairlearn.

**FAT Forensics** (Fairness, Accountability, Transparency), développé par l'Université de Bristol, adopte une approche modulaire permettant d'évaluer la fairness, l'explicabilité et la transparence d'un modèle dans un cadre unifié. C'est un outil plus orienté recherche que production, mais qui offre des perspectives intéressantes pour l'audit holistique des systèmes d'IA.

D'autres outils méritent d'être mentionnés : **TensorFlow Fairness Indicators** pour les pipelines TensorFlow, le **Holistic AI Library** pour la gestion des risques IA, et **FairTest** (Columbia University) pour la découverte d'associations non justifiées entre entrées et sorties.

Soyons honnêtes : ces outils sont géniaux, mais il faut savoir coder en Python pour les utiliser. Pour un dirigeant de PME qui n'a jamais touché à pandas, c'est juste hors de portée.

### **2.3.2 Les outils émergents (2024-2025)**

Deux développements récents méritent une attention particulière.

**LangBiTe**, développé par l'Universitat Oberta de Catalunya et l'Université du Luxembourg, est une plateforme open source spécifiquement conçue pour tester les biais des grands modèles de langage (LLM). Elle contient plus de 300 prompts couvrant l'âgisme, l'homophobie, les biais politiques, les préjugés religieux, le racisme, le sexisme et la xénophobie. Son originalité tient à son alignement explicite avec les exigences de non-discrimination de l'AI Act. L'Institut luxembourgeois des sciences et technologies l'a adopté pour construire un classement éthique des LLM.

L'**outil de détection non supervisée des biais** d'Algorithm Audit, une association néerlandaise, propose une approche radicalement différente. Fonctionnant entièrement dans le navigateur (les données ne quittent jamais la machine de l'utilisateur), il identifie des clusters de traitement inéquitable sans nécessiter de labels démographiques. Cette approche contourne élégamment le paradoxe de l'article 10(5) de l'AI Act : comment détecter une discrimination fondée sur l'origine ethnique si l'on ne dispose pas de données sur l'origine ethnique ? L'outil a été reconnu par l'OCDE dans son *Catalogue of Tools for Trustworthy AI* et a été utilisé pour auditer un algorithme de profilage de risque du gouvernement néerlandais appliqué à 250 000 étudiants.

### **2.3.3 Les solutions commerciales**

Du côté des solutions payantes, **Fiddler AI** propose un monitoring de modèles avec alertes sur les dérives de fairness. **TruEra**, acquis par Snowflake en 2025, intègre la qualité des modèles directement dans le cloud de données. **Accenture** dispose d'un outil d'évaluation de la fairness à destination des grandes entreprises.

> **[FIGURE 6 — Tableau comparatif des outils de détection des biais]** Tableau à 7 colonnes : Outil | Développeur | Open Source ? | Interface graphique ? | Lien AI Act ? | Coût | Adapté PME ?. Lignes : Fairlearn, AIF360, FAT Forensics, LangBiTe, Algorithm Audit, Fiddler AI, TruEra, AuditIQ. Mettre AuditIQ en surbrillance pour montrer son positionnement unique (seul outil cochant : gratuit + interface graphique + lien AI Act + adapté PME). Créer dans Word ou Excel.

### **2.3.4 Les lacunes identifiées**

Premièrement, **l'accessibilité**. C'est un obstacle rédhibitoire pour la majorité des PME.

Deuxièmement, **l'alignement réglementaire**. Il manque une couche d'interprétation réglementaire.

Troisièmement, **la génération de rapports**. Or, les outils existants produisent des sorties techniques (graphiques, tableaux, métriques) mais pas des rapports structurés au format attendu par un auditeur ou un régulateur.

Quatrièmement, **la guidance**. Face au résultat d'impossibilité de Chouldechova et à la multiplicité des métriques, les utilisateurs non experts ont besoin d'être guidés dans le choix de la métrique pertinente pour leur cas d'usage et dans l'interprétation des résultats. Aucun outil existant ne propose de recommandations contextualisées en ce sens.

### **2.3.5 Synthèse : la triple lacune et le concept de triple interface**

**La première interface est cognitive.** Elle relie le vocabulaire formel de la fairness (Demographic Parity, Equalized Odds, False Positive Rate, règle des quatre cinquièmes) aux représentations mentales d'un professionnel qui n'a jamais lu Mehrabi et al. (2021) ni Chouldechova (2017). C'est une interface de **traduction sémantique**. Elle consiste à rendre un concept technique utilisable sans que son utilisateur ait besoin d'en maîtriser la formalisation mathématique. Cette traduction est loin d'être cosmétique. Elle engage des arbitrages de fond : que faut-il dire à l'utilisateur, et que faut-il lui épargner sans le tromper ? Comment signaler un risque sans provoquer un rejet par peur ou par incompréhension ? Les travaux de Bhatt et al. (2020) sur l'explicabilité des systèmes d'IA en contexte professionnel documentent la difficulté de cet exercice. Les explications trop techniques sont ignorées, les explications trop simples sont méprisées, et le point d'équilibre varie d'un utilisateur à l'autre.

**La deuxième interface est technique.** Elle relie les données brutes dont dispose une PME (un export CSV d'un outil RH, un log d'appels à un chatbot, un tableau Excel bricolé par le responsable marketing) à un pipeline de calcul capable d'en extraire des métriques exploitables. Autant de gestes triviaux pour un data scientist et insurmontables pour un dirigeant de PME livré à lui-même.

**La troisième interface est réglementaire.** Elle relie les résultats numériques d'un audit (« Demographic Parity Difference = 0,23 ») au corpus juridique applicable — AI Act, Code du travail, RGPD, doctrine CNIL, jurisprudence du Défenseur des droits. Fairlearn calcule des métriques. C'est là que réside, selon moi, la contribution potentielle la plus originale d'AuditIQ : non dans les algorithmes qu'il utilise (tous empruntés à l'écosystème open source), mais dans la manière dont il construit cette troisième interface en ancrant chaque métrique dans un article précis du règlement et dans une référence de droit français.

Ce que je propose de retenir, comme cadre d'analyse pour la suite du mémoire et comme éventuelle contribution à la littérature, c'est que **l'accessibilité d'un outil d'audit de fairness se mesure à la qualité conjointe de ces trois interfaces**. La partie 4 détaille la manière dont cette ambition a été concrètement traduite en code.

## **2.4 Conclusion de la revue de littérature**

Ce fossé n'est pas principalement technique — les briques existent. Il est avant tout un problème d'interface, au sens large du terme : interface utilisateur (comment rendre ces outils utilisables sans code), interface réglementaire (comment relier les métriques aux obligations), et interface cognitive (comment aider des non-spécialistes à comprendre et à agir sur les résultats).

C'est précisément ce triple problème d'interface que le MVP AuditIQ se propose de résoudre. La méthodologie décrite dans la partie suivante détaille comment j'ai abordé cette ambition, tant du côté de la recherche empirique que du développement technique.

# **PARTIE 3 : CHOIX DE LA MÉTHODOLOGIE**

Le choix d'une méthodologie n'est jamais neutre. Cette partie détaille et justifie ces choix.

## **3.1 Détermination de l'approche de recherche**

### **3.1.1 Pourquoi une approche mixte ?**

Ma problématique — comment permettre aux PME de détecter facilement les biais de leurs algorithmes IA — appelle à la fois des réponses mesurables et des compréhensions en profondeur. J'avais besoin de quantifier l'ampleur du problème (combien de PME utilisent l'IA sans évaluer les biais ? quel budget y consacrent-elles ?) et en même temps de comprendre les mécanismes sous-jacents (pourquoi ne le font-elles pas ? quels sont les freins perçus ? qu'est-ce qui les motiverait à agir ?).

Une approche purement quantitative m'aurait donné des chiffres, mais pas les raisons derrière ces chiffres. Une approche purement qualitative m'aurait offert des récits riches, mais sans possibilité de généralisation. L'approche mixte, telle que définie par Creswell et Plano Clark (2018), permet de croiser les deux perspectives et de les enrichir mutuellement. Les données quantitatives identifient les tendances, les données qualitatives les expliquent.

Concrètement, j'ai adopté un design séquentiel explicatif. Ce séquencement n'est pas arbitraire : il m'a permis de construire mes guides d'entretien en m'appuyant sur les premières tendances observées dans les réponses au sondage.

> **[FIGURE 7 — Schéma du design méthodologique séquentiel explicatif]** Diagramme en flux horizontal : [Revue de littérature] → [Conception sondage] → [Collecte quanti (34 répondants)] → [Analyse préliminaire] → [Construction guide d'entretien] → [Entretiens semi-directifs] → [Analyse thématique] → [Cahier des charges MVP] → [Design Thinking + Développement Agile] → [MVP AuditIQ]. Deux couleurs : bleu pour la phase recherche, orange pour la phase développement. Créer avec draw.io, Miro ou PowerPoint.

### **3.1.2 Le volet quantitatif : conception et diffusion du sondage**

Le sondage a été conçu sur Microsoft Forms et diffusé auprès de professionnels travaillant dans des PME ou en contact avec des PME utilisant l'IA. Le questionnaire comprenait dix questions couvrant quatre thématiques : le profil de l'entreprise (secteur, taille), les usages de l'IA, la connaissance et la perception des biais algorithmiques, et l'intérêt pour un outil de détection.

Le choix de Microsoft Forms s'explique par des raisons pratiques : gratuité, facilité de diffusion par lien, et fonction d'analyse intégrée permettant un premier traitement des résultats sans outil tiers. Le sondage a été diffusé via des réseaux professionnels et des contacts directs, sur une période de plusieurs semaines.

J'ai obtenu 34 réponses exploitables. Dans le cadre d'un mémoire de projet, les données empiriques servent d'abord à ancrer les décisions de conception dans la réalité du terrain, pas à produire des résultats publiables dans une revue à comité de lecture.

La composition de l'échantillon présente une diversité sectorielle intéressante : technologies et informatique (32,4 %), finance et assurance (20,6 %), santé (11,8 %), services aux entreprises (8,8 %), industrie (5,9 %), et divers (20,6 %). La répartition par taille est plus hétérogène, avec 44,1 % d'entreprises de plus de 250 salariés, ce qui dépasse la définition stricte de la PME. J'ai néanmoins conservé ces réponses parce qu'elles éclairent utilement la comparaison entre les pratiques des petites et des grandes structures.

### **3.1.3 Le volet qualitatif : entretiens semi-directifs**

Pour compléter les données du sondage, j'ai mené des entretiens semi-directifs avec des professionnels qui ont accepté d'échanger sur leur expérience avec l'IA et les biais algorithmiques. J'ai retenu le format semi-directif parce qu'il offre un cadre suffisamment structuré pour permettre la comparaison entre les entretiens, tout en laissant assez de latitude pour suivre les pistes inattendues que les répondants pouvaient ouvrir.

Le guide d'entretien couvrait trois grands axes : l'expérience concrète de l'entreprise avec l'IA (quels outils, pour quels usages, depuis quand), la perception des risques liés aux biais (conscience du problème, expérience directe ou indirecte de discrimination algorithmique, connaissance de l'AI Act), et les attentes vis-à-vis d'un outil de détection (fonctionnalités souhaitées, format préféré, budget envisageable, freins anticipés).

Les entretiens ont été retranscrits et analysés selon une méthode d'analyse thématique inspirée de Braun et Clarke (2006). J'ai procédé à un codage ouvert des transcriptions, puis regroupé les codes en thèmes émergents. Cette approche, volontairement inductive, cherchait à laisser émerger les préoccupations réelles des praticiens plutôt qu'à les forcer dans des catégories prédéfinies.

### **3.1.4 Limites méthodologiques et stratégies d'atténuation**

**Biais de sélection de l'échantillon.** Le sondage a été diffusé via des réseaux professionnels et des contacts personnels, ce qui introduit un biais de convenance. Les répondants sont probablement plus sensibilisés au numérique que la moyenne des PME — le fait que 32,4 % travaillent dans le secteur technologique en est un indice. Les résultats sous-estiment donc probablement l'ampleur de la méconnaissance des biais algorithmiques dans l'ensemble du tissu économique. Si 38 % de cet échantillon relativement informé ne connaissent pas les biais algorithmiques, on peut raisonnablement estimer que ce pourcentage dépasse 50 % dans la population générale des dirigeants de PME.

**Taille de l'échantillon.** Avec 34 réponses, les marges d'erreur statistiques sont significatives. Autrement dit, il faut prendre les pourcentages comme des tendances, pas comme des résultats représentatifs au sens INSEE du terme.

**Désirabilité sociale dans les entretiens.** Les entretiens portant sur des sujets sensibles (discrimination, conformité réglementaire), les répondants ont pu avoir tendance à minimiser leurs lacunes ou à exagérer leur intérêt pour un outil éthique. J'ai tenté d'atténuer ce biais en posant des questions indirectes (« que font vos concurrents sur ce sujet ? » plutôt que « que faites-vous ? ») et en commençant les entretiens par des questions descriptives avant d'aborder les questions évaluatives.

**Triangulation.** Pour compenser ces limites, j'ai systématiquement cherché à trianguler les données du sondage avec celles des entretiens, et les deux avec la littérature existante. Lorsque mes données de terrain convergent avec les résultats de l'étude *Harvard Business Review* (2025) ou du rapport Accountancy Europe (2025), la confiance dans les conclusions est renforcée, même si mon échantillon reste modeste.

## **3.2 Méthodologie de développement du MVP**

### **3.2.1 Le Design Thinking comme cadre de conception**

La phase de développement d'AuditIQ s'est inscrite dans un processus de Design Thinking. Partir de leurs besoins, de leurs contraintes et de leur vocabulaire n'était pas un luxe méthodologique, c'était une nécessité.

Le processus de Design Thinking s'est décliné en cinq phases, que j'ai adaptées au contexte de ce projet.

La phase d'**empathie** a coïncidé avec la collecte de données (sondage et entretiens). Par exemple, la crainte que l'audit de fairness révèle des problèmes qu'elles n'ont pas les moyens de corriger.

La phase de **définition** a consisté à synthétiser les insights de la recherche en un énoncé de besoin clair : « Les PME ont besoin d'un outil qui leur permette d'évaluer la fairness de leurs modèles d'IA sans expertise en data science, et de produire une documentation alignée sur les exigences de l'AI Act, pour un coût quasi nul. »

La phase d'**idéation** a exploré plusieurs pistes de solution : un plugin pour tableurs, une application desktop, un service en ligne avec API, une plateforme SaaS complète. J'ai retenu la plateforme SaaS pour plusieurs raisons : accessibilité universelle (pas d'installation), mise à jour centralisée (important dans un contexte réglementaire évolutif), et possibilité de collaboration en équipe.

La phase de **prototypage** a donné lieu au développement itératif du MVP, détaillé dans la partie suivante.

La phase de **test** a impliqué des sessions d'évaluation avec des utilisateurs cibles pour valider les choix de conception et identifier les points d'amélioration.

> **[FIGURE 8 — Schéma des 5 phases du Design Thinking appliquées au projet]** Diagramme en double diamant ou en 5 hexagones enchaînés : Empathie (sondage + entretiens) → Définition (énoncé du besoin) → Idéation (exploration solutions : plugin tableur, app desktop, SaaS...) → Prototypage (développement itératif AuditIQ) → Test (sessions utilisateurs). Pour chaque phase, indiquer les livrables produits. Créer avec Canva, Figma ou PowerPoint.

### **3.2.2 La méthodologie agile pour le développement**

Le développement technique d'AuditIQ a suivi une méthodologie agile, organisée en sprints courts. Le cycle en cascade, avec ses phases rigides et ses livrables séquentiels, aurait été inadapté à un projet où les spécifications elles-mêmes émergent de la recherche empirique.

Chaque sprint durait environ deux semaines et se concluait par une revue des fonctionnalités développées et une planification du sprint suivant. Les priorités étaient définies en fonction de la valeur utilisateur : les fonctionnalités qui répondaient directement aux besoins exprimés dans le sondage et les entretiens ont été traitées en premier.

Le backlog du projet a été géré via un outil de gestion de projet partagé, conformément aux exigences du syllabus. Cet outil a permis de tracer l'évolution du projet, les décisions prises, et les ajustements opérés en cours de route.

## **3.3 Outils et technologies**

Le choix de la stack technologique a été guidé par trois critères : la maturité des technologies (pas de risque de dépendance à une librairie expérimentale), la compatibilité avec l'écosystème de fairness existant (Fairlearn est en Python, ce qui imposait un backend Python), et la qualité de l'expérience utilisateur (qui exigeait un framework frontend moderne et réactif).

**Frontend** : Next.js 16 avec TypeScript, Tailwind CSS et Shadcn/UI pour l'interface, Zustand pour la gestion d'état, Recharts pour les visualisations, et Framer Motion pour les animations. Le choix de Next.js s'explique par sa capacité à combiner rendu côté serveur et côté client, ce qui améliore les performances perçues et le référencement.

**Backend** : FastAPI avec Python 3.10+, PostgreSQL via Supabase, SQLAlchemy en mode asynchrone. Le choix de Supabase comme base de données managée réduit la charge d'infrastructure et offre des fonctionnalités d'authentification intégrées.

**Moteur de fairness** : Fairlearn et Scikit-learn pour le calcul des métriques et l'application des algorithmes de mitigation. Pandas et NumPy pour la manipulation des données. SciPy et Statsmodels pour les analyses statistiques avancées de l'Auto EDA.

**Intelligence artificielle** : Google Gemini API pour la génération de recommandations contextualisées. Ce choix, plutôt qu'un modèle auto-hébergé, s'explique par la qualité des réponses en langage naturel et le coût réduit pour un MVP.

**Génération de rapports** : ReportLab pour les PDF et OpenPyXL pour les fichiers Excel, permettant de produire des rapports de conformité dans des formats standards utilisés par les auditeurs et les régulateurs.

**Déploiement** : frontend sur Netlify, backend dockerisé sur Render, base de données sur Supabase. Cette architecture cloud permet un déploiement continu et une scalabilité sans gestion d'infrastructure.

## **3.4 Considérations éthiques**

Un projet qui porte sur les biais algorithmiques se doit d'être lui-même irréprochable sur le plan éthique. Plusieurs précautions ont été prises.

Pour le sondage et les entretiens, le consentement éclairé des participants a été recueilli. Les données collectées ne sont utilisées que dans le cadre de ce mémoire et ne seront pas partagées à des tiers.

Concernant le MVP, la plateforme AuditIQ a été conçue avec le principe de minimisation des données du RGPD en tête. Les jeux de données uploadés par les utilisateurs sont traités côté serveur pour le calcul des métriques, mais ne sont pas conservés au-delà de la session d'audit sauf demande explicite de l'utilisateur. L'outil d'Algorithm Audit, qui traite les données entièrement dans le navigateur, a constitué une source d'inspiration sur ce point. Même si l'architecture SaaS d'AuditIQ impose certains transferts côté serveur pour les calculs lourds.

Enfin, j'ai veillé à ne pas présenter AuditIQ comme une solution suffisante en soi pour la conformité à l'AI Act. L'outil est un point de départ, pas un certificat de conformité. Cette nuance est explicitement communiquée dans l'interface et dans les rapports générés.

## **3.5 Conclusion de la méthodologie**

La méthodologie adoptée pour ce projet combine rigueur académique et pragmatisme de développement. La méthodologie agile permet d'itérer rapidement et de s'adapter aux découvertes en cours de route.

Cette combinaison n'est pas sans limites. Ces limites sont assumées et discutées dans la conclusion du mémoire.

La partie suivante présente les résultats concrets de cette méthodologie : l'analyse des données collectées et le développement technique d'AuditIQ.

# **PARTIE 4 : ANALYSE ET DÉVELOPPEMENT**

## **4.1 Analyse des données collectées**

### **4.1.1 Analyse quantitative : résultats du sondage**

Le sondage « IA et Éthique dans les PME — Enquête 2025 » a recueilli 34 réponses exploitables, avec un temps moyen de complétion de 2 minutes et 35 secondes. Un sondage trop long aurait généré de l'abandon, surtout auprès de professionnels sollicités pendant leur temps de travail.

**Profil des répondants.**

La répartition sectorielle montre une prédominance du secteur technologique (32,4 %), suivi de la finance et de l'assurance (20,6 %) et de la santé (11,8 %). Cette distribution n'est pas représentative de l'économie dans son ensemble, mais elle est pertinente pour mon sujet : ces trois secteurs sont précisément ceux où l'IA est le plus déployée et où les risques de biais sont les mieux documentés. Le recrutement et le scoring de crédit — deux cas d'usage identifiés comme « haut risque » par l'AI Act — sont massivement présents dans ces secteurs.

La répartition par taille révèle un échantillon hétérogène : 11,8 % de micro-entreprises (1-9 salariés), 20,6 % de petites entreprises (10-49), 14,7 % de moyennes entreprises (50-249), et 44,1 % de grandes entreprises (250+). La surreprésentation des grandes structures dans mon échantillon pourrait constituer un biais, mais elle offre aussi un point de comparaison utile. Elle permet de mettre en regard les pratiques des PME et celles des organisations mieux dotées en ressources.

**Usages de l'IA.**

La question sur les usages de l'IA était à choix multiples, ce qui explique que le total des réponses dépasse 34. Les résultats montrent une diversité d'usages : recrutement par tri de CV et scoring (17 %), service client via chatbots (17 %), marketing personnalisé (14,9 %), scoring clients (6,4 %), et recommandations produits (6,4 %). Fait notable, 14,9 % des répondants déclarent n'avoir aucun usage de l'IA — ce qui signifie que 85 % en utilisent sous une forme ou une autre. La catégorie « autre » (23,4 %) regroupe probablement des usages internes moins formalisés : analyse prédictive, automatisation de processus, outils d'aide à la décision.

**Connaissance des biais algorithmiques.**

Les résultats sur la connaissance des biais sont sans doute les plus révélateurs de l'enquête. 38,2 % des répondants déclarent ne jamais avoir entendu parler de biais algorithmiques. Si on ajoute les 20,6 % qui n'en ont qu'une connaissance vague, on atteint près de 60 % de l'échantillon qui n'a pas de compréhension solide du phénomène. Seuls 23,5 % déclarent « bien connaître » le sujet.

> **[FIGURE 9 — Diagramme en barres : Intérêt pour un outil de détection des biais]** Source : Sondage, Q6. Barres horizontales : « Intéressé si simple » 44,1 %, « Moyennement intéressé » 23,5 %, « Très intéressé, besoin urgent » 20,6 %, « Pas intéressé » 11,8 %. Regrouper visuellement les 3 premières barres (intéressés = 88,2 %) vs la dernière (non intéressés = 11,8 %) avec une accolade ou un encadré.

> **[FIGURE 10 — Graphique croisé : Perception du risque vs. Connaissance des biais]** Diagramme à 2 axes : axe X = niveau de connaissance des biais (Q4), axe Y = perception du risque discriminatoire (Q5). Montrer que même les répondants « Non, jamais » perçoivent un risque (44 % répondent « Oui, c'est probable » ou « Peut-être »). Utiliser un scatter plot ou un diagramme en mosaïque. Créer avec Excel ou Python matplotlib.

**Perception du risque discriminatoire.**

Malgré cette méconnaissance, la perception du risque est étonnamment lucide. 44,1 % des répondants estiment que leurs outils IA pourraient discriminer, et 26,5 % reconnaissent qu'ils ne sauraient pas le vérifier. Seuls 20,6 % affirment que leurs outils sont « neutres » — une affirmation qui traduit probablement davantage un manque de questionnement qu'une certitude fondée.

Le croisement de ces deux résultats révèle un paradoxe intéressant : beaucoup de répondants soupçonnent un problème qu'ils ne sont pas en mesure de nommer. C'est exactement le type de situation où un outil accessible, capable de traduire une intuition en diagnostic concret, peut faire la différence.

**Intérêt pour un outil de détection.**

La question sur l'intérêt pour un outil de détection des biais confirme la demande latente. 44,1 % des répondants se disent intéressés « si l'outil est simple », et 20,6 % expriment un « besoin urgent ». Au total, près de deux tiers de l'échantillon manifestent un intérêt, ce qui valide le postulat de départ du projet.

La condition « si simple » n'est pas anodine. Elle exprime une exigence qui doit guider toute la conception d'AuditIQ : la simplicité n'est pas un bonus, c'est un prérequis. Un outil techniquement irréprochable mais complexe d'utilisation échouera à toucher sa cible.

**Contraintes budgétaires.**

Les données sur le budget sont peut-être les plus brutales. 35,3 % des répondants ne disposent d'aucun budget pour l'audit éthique IA — zéro euro. 17,6 % disposent de moins de 500 euros. 29,4 % se situent dans la fourchette 500-2 000 euros. Et seuls 5,9 % peuvent mobiliser plus de 2 000 euros.

Pour donner un ordre de grandeur : un audit de biais par un cabinet spécialisé coûte généralement entre 5 000 et 50 000 euros selon la complexité du système audité, d'après les données disponibles sur le marché new-yorkais (où la *Local Law 144* a créé un marché structuré d'audits de biais). Même le bas de cette fourchette est inaccessible pour 82 % de mon échantillon — ceux qui disposent de moins de 2 000 euros. Ce décalage entre le coût du marché et la capacité financière des PME est l'argument économique le plus fort en faveur d'une solution automatisée et abordable comme AuditIQ.

Ces chiffres ont des implications directes sur la stratégie produit d'AuditIQ. Un modèle freemium, avec des fonctionnalités premium pour les entreprises disposant d'un budget, semble le plus adapté.

**Analyses croisées : des patterns révélateurs.**

Au-delà des résultats bruts par question, j'ai effectué des croisements entre variables qui font émerger des patterns intéressants.

Le croisement entre la taille de l'entreprise et la connaissance des biais montre, sans surprise, que la connaissance augmente avec la taille. Elles « sentent » le risque sans disposer du vocabulaire technique pour le nommer.

Le croisement entre le secteur d'activité et l'intérêt pour un outil de détection révèle que les répondants du secteur finance/assurance expriment l'intérêt le plus fort (proportion plus élevée de « très intéressé, besoin urgent »). Ce résultat s'explique probablement par la pression réglementaire déjà existante dans ce secteur (exigences ACPR, directives européennes sur le crédit) qui a sensibilisé les professionnels aux enjeux de non-discrimination avant même l'AI Act.

Le croisement entre le budget et l'intérêt confirme un résultat attendu mais important : les répondants avec un budget de 0 euro ne sont pas moins intéressés que les autres par un outil de détection — au contraire, leur intérêt est proportionnellement plus élevé. Un outil gratuit ou à très bas coût comblerait un vrai besoin.

### **4.1.2 Analyse qualitative : enseignements des entretiens**

Les entretiens semi-directifs ont permis de donner chair aux chiffres du sondage. Plusieurs thèmes récurrents ont émergé de l'analyse thématique. Je les présente ici avec des verbatims anonymisés pour illustrer chaque thème.

**Thème 1 : La confusion entre IA et automatisation.** Plusieurs interlocuteurs ne faisaient pas spontanément la distinction entre un système d'IA au sens de l'AI Act et un simple outil d'automatisation. Cette confusion est problématique parce qu'elle conduit à sous-estimer le périmètre des systèmes concernés par la réglementation.

**Thème 2 : La peur de « ce qu'on pourrait trouver ».** Plusieurs répondants ont exprimé, de manière plus ou moins directe, une réticence à auditer leurs outils IA. La connaissance du problème sans les moyens de le résoudre peut être perçue comme un risque supplémentaire plutôt que comme un progrès.

Ce dilemme n'est pas sans fondement juridique. C'est ce que les juristes appellent le « dilemme de l'audit » : savoir peut engager la responsabilité plus que ne pas savoir.

Cette observation a directement influencé la conception d'AuditIQ. L'objectif est de ne jamais laisser l'utilisateur face à un diagnostic sans solution, même partielle.

**Thème 3 : Le besoin de « preuve » vis-à-vis des parties prenantes.** Un thème inattendu a émergé de plusieurs entretiens : le besoin de disposer d'un document formel attestant que l'entreprise a pris en compte la question des biais. Si on n'a rien de formel, on est désavantagé par rapport aux grands groupes qui ont des rapports RSE. » Ces verbatims illustrent un besoin concret que le module de génération de rapports d'AuditIQ cherche à combler.

**Thème 4 : L'isolement décisionnel.** Contrairement aux grandes entreprises qui disposent d'un DPO, d'un responsable éthique ou d'un comité IA, les PME prennent souvent leurs décisions liées à l'IA de manière isolée — un dirigeant, un CTO, parfois un développeur seul. « Je suis le seul à décider de ces sujets dans l'entreprise. AuditIQ, avec ses feux tricolores, ses explications en langage naturel et ses recommandations contextualisées, joue en quelque sorte le rôle du collègue expert que ces décideurs n'ont pas.

**Thème 5 : La méfiance envers les solutions « trop techniques ».** Plusieurs interlocuteurs ont spontanément exprimé leur méfiance vis-à-vis des outils de data science, même quand ils en reconnaissaient l'utilité. « On a essayé un outil d'analyse de données l'année dernière. Cette observation a guidé mes choix de design pour AuditIQ : priorité à la clarté visuelle, absence de jargon technique dans l'interface, et processus d'audit en étapes guidées plutôt qu'en mode « tableau de bord expert ».

### **4.1.3 Synthèse : du diagnostic au cahier des charges**

Le croisement des données quantitatives et qualitatives fait émerger un portrait cohérent du besoin. Elles ont besoin d'un outil qui soit :

* **Accessible sans compétence en data science** (condition posée par 44,1 % des répondants intéressés)  
* **Gratuit ou très abordable** (plus de 50 % ont un budget inférieur à 500 euros)  
* **Capable de produire des rapports formels** (besoin de « preuve » identifié dans les entretiens)  
* **Doté de recommandations actionnables** (pour dépasser le stade du diagnostic)  
* **Aligné sur les exigences de l'AI Act** (pour anticiper la conformité réglementaire)

Ce cahier des charges a guidé l'ensemble du développement d'AuditIQ, que je détaille maintenant.

## **4.2 Développement du MVP : AuditIQ**

### **4.2.1 Vision produit refondée : un outil de première ligne**

AuditIQ se positionne comme une plateforme SaaS d'audit de fairness IA conçue pour les PME françaises et, par extension, européennes. Sa proposition de valeur tient en une phrase : « Détectez et documentez les biais de vos systèmes d'IA en moins d'une heure, sans écrire une ligne de code, avec un rapport aligné sur l'AI Act et le droit français. »

Je veux insister ici sur trois mots — **détecter**, **documenter**, **première ligne** — qui traduisent la refonte de scope opérée au cours du projet.

**Détecter, pas corriger.** AuditIQ met au jour un signal de risque ; il ne le fait pas disparaître. Les algorithmes de mitigation — `CorrelationRemover`, `ExponentiatedGradient`, `ThresholdOptimizer` de Fairlearn — existent et sont puissants, mais leur application nécessite des arbitrages normatifs que je ne veux pas qu'un outil prenne à la place de son utilisateur. J'ai délibérément retiré du MVP toute fonctionnalité de mitigation automatique. Elle aurait contredit le principe de supervision humaine de l'article 14 de l'AI Act, et elle aurait été dangereuse dans les mains d'utilisateurs non formés.

**Documenter, comme geste de conformité.** Documenter un résultat est, pour une PME, à peu près aussi important que le résultat lui-même. L'article 11 et l'annexe IV de l'AI Act imposent une documentation technique tracée, auditable, et versionnée. Un simple export PDF d'un rapport structuré, produit automatiquement, couvre une part significative de cette obligation. C'est un geste qu'AuditIQ sait faire de bout en bout et qui constitue, à lui seul, un différenciant par rapport aux frameworks en ligne de commande.

**Première ligne, pas certificat.** AuditIQ est un outil d'amorçage. Les rapports indiquent systématiquement les limites de la démarche et rappellent que l'article 43 de l'AI Act prévoit, pour les systèmes à haut risque, une évaluation de conformité qui dépasse le périmètre d'un outil d'auto-diagnostic.

Par rapport aux frameworks open source (Fairlearn, AIF360), AuditIQ apporte une interface graphique complète, une couche d'interprétation en langage naturel, et un ancrage réglementaire explicite. Par rapport aux solutions commerciales (Fiddler, TruEra), il cible les PME avec un coût marginal nul et une simplicité d'usage radicale. Par rapport aux outils émergents (Algorithm Audit pour le non-supervisé, LangBiTe pour les LLM), il offre une solution intégrée qui couvre simultanément les trois cas d'usage les plus courants dans une PME : données labellisées, données non labellisées, chatbot. Ce dernier point — l'intégration — est la contribution la plus concrète d'AuditIQ au paysage existant.

### **4.2.2 Architecture technique : trois modules sur un socle commun**

> **[FIGURE 11 — Diagramme d'architecture technique d'AuditIQ (version refondue)]**
> *Schéma en couches montrant le socle commun (Next.js frontend, FastAPI backend, Supabase/PostgreSQL, couche d'interprétation, générateur de rapports, Google Gemini pour les explications) et, en colonnes parallèles, les trois modules : (1) Audit supervisé — Fairlearn/Scikit-learn, (2) Détection non supervisée — KMeans + chi2, (3) Audit LLM — banque de prompts paired. Flèche unique de sortie vers le générateur de rapports PDF/Excel. Créer avec draw.io ou Lucidchart.*

L'architecture globale d'AuditIQ suit un modèle client-serveur classique, mais elle a été pensée dès le départ pour accueillir plusieurs pipelines d'audit sur un socle commun.

Le **frontend**, développé en Next.js 16 avec TypeScript, gère l'ensemble de l'expérience utilisateur. Les visualisations — élément central pour un outil d'audit — utilisent Recharts : barres comparatives pour les métriques par groupe, jauges pour les scores globaux, tableaux détaillés pour les utilisateurs qui veulent creuser.

Le **backend**, construit sur FastAPI avec Python 3.10+, expose une API REST documentée automatiquement via Swagger UI. Cette suppression est assumée en 4.2.8 : ces routers outrepassaient le scope du critère « facilement ».

La base de données **PostgreSQL** hébergée sur **Supabase** stocke les comptes utilisateurs, les métadonnées des audits et les résultats historiques. L'authentification combine JWT, OAuth2 et hachage Bcrypt ; le rate limiting est assuré par SlowAPI ; le middleware CORS restreint les origines autorisées.

La couche **Fairlearn + Scikit-learn + SciPy** porte la logique scientifique du Module 1 et du Module 2. La couche **Google Gemini** (API) est utilisée non pas pour générer des décisions, mais pour produire les **explications en langage naturel** attachées à chaque résultat chiffré — c'est un choix important, détaillé en 4.2.6. **ReportLab** et **OpenPyXL** produisent les rapports finaux.

Les trois modules décrits dans les sous-sections qui suivent partagent ce même socle technique. Les trois modules ne sont pas trois produits, ils sont trois pipelines d'analyse greffés sur une même plateforme.

### **4.2.3 Module 1 — Audit supervisé classique**

Le Module 1 est l'héritier direct de la première version d'AuditIQ. Ce cas d'usage correspond, dans mon échantillon, aux répondants du secteur finance/assurance et à certaines structures RH matures.

Le flux de traitement est le suivant. Duke Power, 1971 ; EEOC Uniform Guidelines, 1978) — pour chaque attribut sensible déclaré.

En coulisses, le calcul utilise la classe `MetricFrame` de Fairlearn, qui permet de désagréger n'importe quelle métrique Scikit-learn par groupe. J'ai encapsulé cette fonctionnalité dans une couche d'abstraction qui traduit les résultats techniques en indicateurs immédiatement compréhensibles : un système de feux tricolores (vert, orange, rouge) associé à une explication en langage naturel. Plutôt que d'afficher « Demographic Parity Difference = 0,23 », AuditIQ affiche : « Écart de parité : 23 %. Le taux de résultats positifs diffère significativement entre les groupes. Le groupe [X] a 23 points de pourcentage de moins que le groupe [Y]. Ce niveau d'écart dépasse le seuil de la règle des quatre cinquièmes et pourrait constituer un risque de non-conformité au regard de l'article 10 de l'AI Act, ainsi qu'une présomption de discrimination indirecte au sens de l'article L.1132-1 du Code du travail. »

Ce module n'est pas techniquement original : il exploite des briques matures. Son apport réside dans la couche de traduction et dans l'intégration avec les deux autres modules via le même rapport final.

> **[FIGURE 12 — Capture d'écran : résultats Module 1 dans AuditIQ]**
> *Capture montrant le tableau de bord après un audit supervisé : feux tricolores par métrique, graphique en barres comparant les groupes sur Demographic Parity, Equal Opportunity et règle des quatre cinquièmes, score global, et encart explicatif en langage naturel. Prendre depuis la démo.*

### **4.2.4 Module 2 — Détection non supervisée (nouveau)**

Le Module 2 est la réponse au **paradoxe de l'article 10(5)** de l'AI Act. Ce texte autorise, à titre exceptionnel, le traitement de catégories particulières de données (origine, santé, convictions) dans le seul but de détecter et corriger des biais, mais cette autorisation reste subordonnée à des garanties strictes — et, en pratique, à un appareil juridique (analyse d'impact, consentement spécifique, minimisation) hors de portée d'une PME. Le Défenseur des droits a rappelé à plusieurs reprises qu'en droit français, la collecte de statistiques ethniques reste très encadrée. La CNIL ne reconnaît pas l'existence d'une base légale automatique pour de tels traitements à des fins d'audit. Autrement dit, les PME françaises sont structurellement **incapables** de produire les données qui alimentent le Module 1, sauf dans les rares cas où les attributs sensibles sont déjà collectés à d'autres fins (genre renseigné via la civilité, par exemple).

C'est exactement le problème que l'association néerlandaise **Algorithm Audit** a posé, et que son outil d'*unsupervised bias detection* résout en renversant la question. Plutôt que de chercher un écart de traitement entre des groupes démographiques déclarés, on cherche des **clusters de traitement** qui dévient significativement de la moyenne, puis on tente de caractériser ces clusters *a posteriori* par leurs features dominantes. Si le cluster des décisions négatives est dominé par le code postal, on a trouvé un signal — même si le mot « origine » n'a jamais été prononcé.

J'ai réimplémenté cette approche dans un *router* dédié, `routers/unsupervised.py`, selon le pipeline suivant.

**Étape 1 — Standardisation.** Les features numériques sont standardisées (moyenne nulle, variance unitaire) via `StandardScaler`. L'objectif est d'éviter que le clustering ne soit dominé par des variables à grande amplitude.

**Étape 2 — Clustering KMeans.** Un KMeans (par défaut k = 5, ajustable) partitionne les observations en clusters sur la base de leurs features — sans utiliser la variable de décision. Le choix de KMeans plutôt que de méthodes plus sophistiquées (DBSCAN, clustering hiérarchique) se justifie par trois arguments : sa simplicité d'interprétation pour un utilisateur non expert, sa stabilité sur des jeux de données de taille modeste typiques des PME, et son intégration native dans Scikit-learn.

**Étape 3 — Calcul du taux de décision positive par cluster.** Pour chaque cluster, on calcule la proportion d'observations ayant reçu la décision positive. Cette proportion est comparée à la moyenne globale.

**Étape 4 — Test du Khi-deux.** Un test du Khi-deux d'indépendance (via `scipy.stats.chi2_contingency`) est appliqué à la table de contingence [cluster × décision]. C'est un signal statistique fort d'un traitement différencié.

**Étape 5 — Identification des clusters déviants.** Tout cluster dont le taux de décision positive dévie de plus d'un seuil configurable (par défaut 20 points de pourcentage) par rapport à la moyenne est marqué comme déviant.

**Étape 6 — Caractérisation post-hoc.** Pour chaque cluster déviant, on identifie les trois features qui contribuent le plus à sa singularité, en calculant pour chaque feature la différence standardisée entre la moyenne du cluster et la moyenne globale. Cette caractérisation est affichée à l'utilisateur en langage naturel : « Ce cluster regroupe principalement des observations dont le code postal commence par 93, dont l'âge est supérieur à 45 ans et dont l'ancienneté professionnelle est inférieure à 2 ans. Ces caractéristiques peuvent être des proxies de critères protégés par l'article L.1132-1 du Code du travail. »

**Étape 7 — Feu tricolore et renvoi à l'AI Act.** Le résultat global est synthétisé par un feu tricolore, accompagné d'une note explicite sur l'article 10 (qualité des données) et l'article 9 (système de gestion des risques) de l'AI Act, ainsi que d'une invitation à conduire un examen manuel des clusters identifiés.

L'avantage décisif de ce module pour une PME française est qu'il **ne requiert aucune donnée sensible au sens du RGPD**. C'est à mes yeux le module le plus original d'AuditIQ, et celui qui résout la contradiction la plus profonde du droit de la fairness.

> **[FIGURE 13 — Capture d'écran : résultats Module 2 (détection non supervisée)]**
> *Capture montrant la visualisation d'un clustering KMeans, avec les clusters déviants en surbrillance, la p-value du chi2, et la caractérisation post-hoc des clusters déviants par leurs features dominantes.*

### **4.2.5 Module 3 — Audit LLM/chatbot (nouveau)**

Le Module 3 est la réponse à un chiffre que je ne pouvais pas laisser sans suite : **17,6 % des répondants à mon sondage déclarent utiliser un chatbot grand public** dans leur activité professionnelle. Ce chiffre a plusieurs implications. D'abord, il signifie qu'une fraction non négligeable des PME expose déjà ses clients ou ses collaborateurs à un système d'IA dont elles ne maîtrisent ni l'entraînement, ni les données, ni les biais. Ensuite, il met ces entreprises sous le coup de l'**article 50 de l'AI Act**, qui impose aux déployeurs de systèmes d'IA générative en contact direct avec le public une obligation de transparence (l'utilisateur doit savoir qu'il parle à une machine) et, plus implicitement, une responsabilité sur le contenu produit. Enfin, il pose un problème auquel aucun des deux premiers modules ne répond : un LLM n'est pas un classifieur binaire, il produit du texte libre. Les métriques de fairness tabulaires (Demographic Parity, Equal Opportunity) n'ont aucun sens pour lui.

Le projet **LangBiTe** (Morales et al., 2024), développé conjointement par l'Universitat Oberta de Catalunya et l'Université du Luxembourg, propose une approche que j'ai trouvée éclairante : tester les biais d'un LLM en lui soumettant des **prompts pairés** qui ne diffèrent que par un attribut sensible, puis en comparant les réponses obtenues. Si le prompt « Décris un ingénieur compétent » produit une réponse chaleureuse et détaillée, tandis que « Décris une ingénieure compétente » produit une réponse courte et stéréotypée, on a un signal de biais de genre. LangBiTe fournit une banque de plus de 300 prompts couvrant l'âgisme, l'homophobie, les biais politiques, les préjugés religieux, le racisme, le sexisme et la xénophobie.

Le *router* `routers/llm_audit.py` que j'ai développé adapte cette approche à la contrainte d'un projet solo et aux spécificités d'un contexte PME français. Les choix de conception sont les suivants.

**Une banque réduite mais calibrée.** Plutôt que de réimplémenter les 300 prompts de LangBiTe, j'ai constitué une banque initiale de **10 prompts pairés** bilingues (français et anglais), couvrant six catégories protégées : genre, origine, âge, religion, handicap et orientation sexuelle. Chaque prompt existe en deux à six versions, qui ne diffèrent que par l'attribut testé. Le choix d'un volume réduit répond à deux contraintes : permettre un audit complet en moins de 30 secondes (compatible avec le critère « facilement »), et limiter le coût d'inférence lorsque le LLM cible est une API payante. La banque est extensible et versionnée dans le code.

**Un appel HTTP générique.** Le module ne suppose rien sur le LLM cible. Ce qui est important pour les PME qui déploient des modèles internes via des plateformes comme Hugging Face.

**Trois métriques d'écart.** Pour chaque paire de prompts, on mesure trois écarts : (1) **écart de longueur** de réponse en nombre de caractères, qui capture les cas où le modèle est plus prolixe pour un groupe que pour un autre ; (2) **écart de sentiment**, calculé via une bibliothèque de *sentiment analysis* appliquée aux deux réponses, qui capture les cas où le modèle est plus positif pour un groupe ; (3) **taux de refus**, qui mesure si le modèle accepte de répondre à l'une des versions du prompt et refuse l'autre — un comportement documenté chez plusieurs modèles qui sur-censurent certaines requêtes.

**Un score agrégé par catégorie et un feu tricolore.** Les trois écarts sont normalisés et agrégés en un score par catégorie (genre, origine, etc.), puis en un score global. Les seuils sont inspirés de ceux retenus par LangBiTe dans ses publications. Chaque score est présenté avec un feu tricolore et un extrait des paires de réponses les plus divergentes, pour que l'utilisateur puisse interpréter qualitativement le signal.

**Un ancrage réglementaire.** Les rapports générés par le Module 3 citent explicitement l'article 50 de l'AI Act et, côté français, la doctrine de la CNIL sur les chatbots en contact avec le public. Ils rappellent aussi les limites méthodologiques de l'approche : un écart de sentiment mesuré sur 10 paires de prompts ne constitue pas une preuve de discrimination — c'est un signal à approfondir.

Ce module est, à ma connaissance, la première intégration d'une approche de type LangBiTe dans un outil d'audit tout-en-un destiné aux PME. Son principal mérite est pratique : un dirigeant de PME qui utilise ChatGPT pour son service client peut, en quelques clics, obtenir un premier diagnostic d'équité de son chatbot et une trace documentée de la démarche, exploitable dans le cadre de l'article 50.

> **[FIGURE 14 — Capture d'écran : résultats Module 3 (audit LLM)]**
> *Capture montrant le tableau de scores par catégorie (genre, origine, âge, religion, handicap, orientation), le feu tricolore global, et deux exemples de paires de prompts les plus divergentes avec les réponses du LLM.*

### **4.2.6 La couche d'interprétation et de traduction**

Les trois modules partagent une même couche d'interprétation, qui est sans doute le composant le plus sous-estimé de l'architecture. Elle fait trois choses.

**Elle applique le système de feux tricolores.** Les seuils ne sont pas choisis arbitrairement. Pour le Module 1, ils s'alignent sur la règle des quatre cinquièmes (seuil à 0,80 sur les ratios de parité) et sur les conventions proposées par Fairlearn dans sa documentation de référence. Pour le Module 2, le feu rouge se déclenche lorsque la *p-value* du chi2 est inférieure à 0,05 **et** qu'au moins un cluster dévie de plus de 20 points de pourcentage. Pour le Module 3, les seuils s'inspirent de ceux de LangBiTe. L'utilisateur peut ajuster ces seuils via une page « paramètres avancés », mais les valeurs par défaut sont documentées et justifiées.

**Elle produit une explication en langage naturel.** Cette explication est générée selon un mécanisme hybride : une trame structurée (chiffres, noms de groupes, seuil franchi) est alimentée par un prompt envoyé à **Google Gemini**, qui la transforme en paragraphe lisible. Le prompt est mis en cache pour limiter les appels API.

**Elle ancre le résultat dans le droit.** Chaque explication se termine par une ou deux références légales contextualisées. Les règles d'ancrage sont simples et codifiées : tout écart détecté dans un contexte d'emploi renvoie à l'article L.1132-1 du Code du travail et à la jurisprudence du Défenseur des droits ; tout écart dans un contexte financier renvoie à la doctrine ACPR et au RGPD ; tout écart dans un chatbot renvoie à l'article 50 de l'AI Act. Ces règles ne prétendent pas à l'exhaustivité d'un conseil juridique — et l'interface le signale — mais elles donnent à l'utilisateur un point d'appui concret pour engager la conversation avec un juriste.

### **4.2.7 La génération de rapports de conformité**

Le générateur de rapports est le module qui ancre AuditIQ dans le contexte spécifique de l'AI Act. Plutôt que de produire des sorties techniques brutes, AuditIQ génère des documents structurés au format PDF (ReportLab) et Excel (OpenPyXL) qui suivent une trame alignée sur les exigences des articles 9, 10 et 11 du règlement.

Un rapport type comprend : un résumé exécutif avec le niveau de risque global, le détail des résultats par module (supervisé, non supervisé, LLM selon ce qui a été exécuté), les visualisations correspondantes, les références au droit français (CNIL, Code du travail, Défenseur des droits, ACPR), et une section de conformité qui met en regard chaque résultat avec l'article pertinent de l'AI Act.

Ce format répond directement au besoin de « preuve » identifié dans les entretiens. Un dirigeant de PME peut télécharger ce rapport et le présenter à son conseil d'administration, l'annexer à un appel d'offres, ou le mettre à disposition d'un auditeur externe. Le rapport n'est pas un certificat — cette nuance est explicitement mentionnée, en première page et en pied de page — mais il constitue une trace documentée de la démarche. Ce qui est en soi un élément de conformité au regard du système de gestion des risques exigé par l'article 9 et de la documentation exigée par l'article 11.

> **[FIGURE 15 — Extrait d'un rapport PDF de conformité (version 3 modules)]**
> *Capture de la page de résumé exécutif (feu tricolore global, synthèse des 3 modules si tous exécutés) et d'une page de détail montrant la mise en regard métrique ↔ article AI Act ↔ référence de droit français.*

### **4.2.8 Choix techniques et arbitrages : ce qui a été retiré**

Je veux expliciter ici les fonctionnalités qui ont été retirées du MVP au cours de la refonte, et pourquoi. Cet exercice de clarification des arbitrages est ce qui, selon moi, distingue un projet planifié d'un prototype gonflé par accumulation.

**Le chatbot assistant IA a été retiré.** La première version d'AuditIQ intégrait un chat conversationnel censé guider l'utilisateur dans son audit. Le parcours *wizard* en quatre étapes, beaucoup plus contraint, s'est révélé plus efficace.

**Le module d'entraînement de modèles ML a été retiré.** La première version proposait d'entraîner des modèles Scikit-learn directement dans l'outil. Le *router* `routers/ml.py` a été commenté dans `main.py`.

**Le module data science généraliste a été retiré.** Les analyses statistiques génériques (ANOVA, factorielles, matrices de corrélation complètes) ont été retirées du produit final pour la même raison. Seule la détection d'anomalies IQR reste intégrée, sous forme d'alerte pré-audit dans les modules 1 et 2, là où elle sert un objectif directement lié à la fairness (déséquilibre des groupes).

**Le what-if interactif a été retiré.** L'exploration contrefactuelle (« que se passe-t-il si je change cette valeur ? ») est un outil puissant, mais il exige une compréhension avancée des données et des modèles. Il reste pertinent pour des data scientists ; il est contre-productif pour des non-spécialistes.

**Le monitoring continu en temps réel a été retiré.** L'article 9 exige un système de gestion des risques couvrant tout le cycle de vie, mais le *monitoring* continu est un chantier d'ingénierie qui suppose un pipeline de production permanent — hors de portée d'un MVP solo. AuditIQ propose en remplacement un scheduler APScheduler qui permet de programmer un audit récurrent (hebdomadaire, mensuel), ce qui couvre raisonnablement le besoin des PME pour un effort de développement réaliste.

## **4.3 Évaluation du prototype**

L'évaluation d'un outil d'audit dont la proposition de valeur est l'« accessibilité » pose une question méthodologique que je me dois d'affronter : comment mesurer la facilité ? Je décris dans cette section le protocole d'évaluation qui sera appliqué au prototype **avant la soutenance**, les résultats qui y seront rattachés, et les limites que j'assume dès maintenant.

#### **4.3.1 Protocole d'évaluation utilisateur**

Le protocole que j'ai conçu combine trois instruments, choisis pour leur équilibre entre rigueur académique et faisabilité dans un projet solo.

**Le System Usability Scale (SUS)**, développé par Brooke (1996), est le questionnaire d'utilisabilité le plus utilisé et le plus validé en IHM. Il comporte dix items en échelle de Likert à cinq niveaux et produit un score sur 100. Un score SUS supérieur à 68 est considéré comme supérieur à la moyenne des outils évalués dans la littérature ; au-dessus de 80, l'outil est considéré comme excellent. Le SUS a deux avantages majeurs : il est court (deux minutes à remplir), ce qui facilite la collecte, et il existe des centaines de points de comparaison publiés. J'administrerai le SUS à chaque testeur à la fin de sa session, pour chaque module utilisé.

**Le *time-on-task***, mesuré au chronomètre par l'observateur, capture le temps nécessaire pour accomplir une tâche standardisée. Tout dépassement significatif sera analysé (étape bloquante, incompréhension, erreur d'interface) et donnera lieu à un correctif lorsque c'est possible avant la soutenance.

**Une comparaison avec Fairlearn en ligne de commande**, réalisée sur un sous-groupe de testeurs ayant des compétences en Python. La comparaison sera documentée par des captures d'écran et des logs de commandes.

#### **4.3.2 Échantillon et modalités**

L'échantillon cible est de **6 à 8 testeurs**, recrutés parmi les profils PME de mon réseau. La taille peut paraître modeste. Elle est en réalité alignée sur la littérature en tests d'utilisabilité, qui montre (Nielsen, 2000) que 5 utilisateurs révèlent environ 85 % des problèmes d'utilisabilité majeurs, et qu'au-delà de 8 à 10 utilisateurs le rendement marginal d'un testeur supplémentaire devient faible. Je cherche délibérément à diversifier l'échantillon sur trois dimensions : le niveau technique (non technique / technique limité / technique confirmé), le secteur (RH, finance, conseil, industrie) et la familiarité avec la fairness (découverte / intermédiaire / avancée). Les sessions se tiennent en visioconférence ou en présentiel, sont enregistrées avec consentement, et durent environ une heure chacune.

Chaque session suit le même déroulé : (1) recueil de profil (5 minutes), (2) présentation rapide de l'outil (5 minutes), (3) exécution des trois tâches (T1, T2, T3) avec *time-on-task* chronométré et *think-aloud* encouragé (30 à 40 minutes), (4) administration du SUS (5 minutes), (5) entretien ouvert sur les points de friction et les attentes (10 minutes). Pour les testeurs techniques, la séquence est complétée par l'exercice de comparaison avec Fairlearn CLI.

#### **4.3.3 Métriques secondaires et tests de fonctionnalité**

En parallèle de l'évaluation utilisateur, j'ai mis en place des tests automatisés qui couvrent les fonctions critiques des trois modules : calcul des métriques par `MetricFrame` sur le dataset de référence *Adult Census Income*, stabilité du clustering KMeans sur des jeux de tests reproductibles, appels *mock* au pipeline LLM avec des prompts et réponses simulées. Ces tests garantissent qu'une évolution future du code ne fausse pas silencieusement les calculs — un risque que je prends très au sérieux, parce qu'un outil d'audit qui calcule mal ses métriques est pire qu'inutile : il est dangereux.

Un point de contrôle particulier est la **validation croisée numérique**. Cette vérification est essentielle pour que l'outil puisse revendiquer une équivalence fonctionnelle avec la référence open source de l'écosystème.

#### **4.3.4 Ce qui sera rapporté dans la version finale**

La version du mémoire déposée pour la soutenance intégrera, dans cette section, les résultats effectivement obtenus : scores SUS individuels et agrégés par module, temps moyens par tâche avec écart-type, verbatims saillants des entretiens, et comparatif chiffré Fairlearn CLI / AuditIQ. Si un module obtient un SUS inférieur à 68, la section en tirera les conséquences et proposera des pistes de remédiation plutôt que de masquer le résultat.

#### **4.3.5 Limites de l'évaluation**

Je veux assumer dès maintenant trois limites du protocole.

Premièrement, la **taille de l'échantillon** (6 à 8) ne permet aucune inférence statistique au sens strict. C'est cohérent avec la littérature en tests d'utilisabilité, mais il faut le dire.

Deuxièmement, le **biais de recrutement**. J'en tiens compte en privilégiant, autant que possible, des personnes qui ne me connaissent que marginalement et en insistant auprès d'elles sur le caractère critique attendu de leurs retours.

Troisièmement, l'**absence de test longitudinal**. Une étude longitudinale serait la suite logique de ce travail ; elle est listée en section 5.3.3 parmi les recherches futures.

#### **4.3.6 Conformité et sécurité**

La conformité RGPD est intégrée dès la conception. L'outil ne prétend pas être un certificat de conformité à l'AI Act — cette nuance est mentionnée explicitement dans l'interface et sur chaque rapport généré.

## **4.4 Conclusion de la partie 4**

L'analyse des données collectées a confirmé l'existence d'un besoin réel et urgent. Le développement d'AuditIQ traduit ce besoin en une plateforme fonctionnelle qui abaisse significativement la barrière d'entrée à l'audit de fairness.

Le MVP n'est pas parfait — aucun MVP ne l'est. La préparation des données reste un point de friction. Les recommandations IA gagneraient à être plus spécifiques par domaine métier. Et la couverture des cas d'usage pourrait être étendue, notamment aux LLM, via une intégration de type LangBiTe. Mais le prototype démontre la viabilité du concept : il est possible de rendre l'audit de fairness accessible aux non-spécialistes, de le relier aux exigences réglementaires, et de le proposer à un coût compatible avec les budgets des PME.

Les enseignements tirés de ce développement, ainsi que les recommandations qui en découlent, font l'objet de la partie finale de ce mémoire.

# **PARTIE 5 : CONCLUSION ET RECOMMANDATIONS**

## **5.1 Synthèse des principaux résultats**

Ce mémoire partait d'une question en apparence simple : comment permettre aux PME françaises de détecter facilement les biais de leurs algorithmes IA pour se conformer à l'AI Act ? Je voudrais, en ouverture de cette conclusion, formuler quatre constats — deux sur le problème, un sur la réponse proposée, un sur les limites — qui résument ce que je retire de l'année écoulée.

**Premier constat : le problème est principalement un problème d'interfaces, pas d'algorithmes.** La revue de littérature a montré que les fondements théoriques et techniques existent, et qu'ils sont matures. Les biais sont formalisés (Mehrabi et al., 2021), les métriques sont stabilisées, les algorithmes de mitigation sont implémentés dans des frameworks comme Fairlearn et AIF360, et le résultat d'impossibilité de Chouldechova (2017) — confirmé et approfondi par Wachter, Mittelstadt et Russell (2021) — a clarifié les arbitrages normatifs. Ce qui manque n'est pas une nouvelle métrique. C'est une **triple interface** qui relie simultanément l'univers cognitif des décideurs non techniques, l'univers technique des pipelines de calcul et l'univers juridique des obligations applicables. Je défends, comme contribution principale de ce mémoire, que c'est cette notion de triple interface — et non un composant technique particulier d'AuditIQ — qui constitue l'apport original du travail.

**Deuxième constat : le fossé empirique est réel mais plus hétérogène que je ne le pensais.** Sur 34 professionnels interrogés, 38 % n'avaient jamais entendu parler de biais algorithmiques, 35 % n'avaient aucun budget pour un audit, mais 44 % soupçonnaient que leurs outils pouvaient discriminer, et 17 % utilisaient déjà un chatbot sans en mesurer les risques. La refonte du MVP en trois modules — audit supervisé, détection non supervisée, audit LLM — est une tentative de répondre à ces trois profils distincts, chacun par le pipeline le plus adapté à sa situation.

**Troisième constat : AuditIQ démontre la faisabilité d'une réponse intégrée à la triple lacune, dans un périmètre volontairement restreint.** La plateforme traduit les métriques techniques en indicateurs compréhensibles (interface cognitive), relie les résultats aux exigences réglementaires (interface réglementaire), et accepte des données réelles via une interface graphique (interface technique). Et le protocole d'évaluation utilisateur décrit en section 4.3 produira, avant la soutenance, les premières mesures quantifiées de la « facilité » revendiquée.

> **[FIGURE 17 — Schéma de synthèse : la triple interface et la réponse AuditIQ]**
> *Diagramme montrant 3 colonnes : Interface cognitive (38 % ne connaissent pas les biais → AuditIQ : explications en langage naturel, feux tricolores), Interface technique (outils existants requièrent du code → AuditIQ : wizard graphique, trois pipelines unifiés), Interface réglementaire (pas de lien métriques ↔ AI Act → AuditIQ : rapports de conformité ancrés dans le droit français). Flèches reliant chaque interface à la fonctionnalité d'AuditIQ qui la construit. Créer avec PowerPoint ou Canva.*

**Quatrième constat : les limites du travail sont substantielles et doivent être assumées.** Je veux les nommer explicitement pour clore cette synthèse sans les masquer.

- **AuditIQ ne couvre qu'environ 15 % des exigences de l'AI Act pour les systèmes à haut risque.** Il adresse les articles 10 et 11 (qualité des données, documentation) et touche implicitement les articles 9, 14, 15 et 50, mais il ne couvre ni le système de management de la qualité (art. 17), ni les procédures d'évaluation de conformité (art. 43). Le mémoire est un mémoire sur la détection et la documentation des biais, pas un mémoire sur la conformité intégrale.
- **L'échantillon d'enquête est de n = 34**, dont 44 % issus de grandes entreprises (ce qui dilue la pertinence du terme « PME »). Les tendances que j'en tire sont informatives, pas statistiquement généralisables. La partie 3 l'explicite, et je le rappelle ici parce que toute la suite du mémoire en dépend.
- **L'évaluation utilisateur porte sur 6 à 8 testeurs**, ce qui suffit à détecter les problèmes majeurs d'utilisabilité (Nielsen, 2000) mais pas à produire des inférences quantitatives robustes. Aucun chiffre de SUS, aucun temps moyen ne peut être sur-interprété.
- **Le Module 2 (non supervisé) produit un signal, pas une preuve.** Un cluster déviant n'est pas automatiquement une discrimination ; il est une invitation à approfondir. Il faut le dire à l'utilisateur, et l'interface le dit.
- **Le Module 3 (LLM) repose sur une banque de prompts réduite**, qui ne prétend pas couvrir exhaustivement les biais possibles d'un LLM. Son mérite est d'ouvrir une première porte, pas de fermer le sujet.

## **5.2 Discussion sur les implications des résultats**

### **5.2.1 Implications pratiques**

La deuxième implication concerne le rôle de l'AI Act comme catalyseur. AuditIQ s'inscrit dans cette dynamique en transformant la contrainte réglementaire en démarche d'amélioration continue.

La troisième implication est que l'audit de fairness ne peut pas être entièrement automatisé. Le résultat d'impossibilité de Chouldechova montre qu'aucun ensemble unique de métriques ne capture « la » fairness. Chaque contexte impose des arbitrages normatifs que la machine ne peut pas trancher seule. Un système de recrutement dans le secteur technologique, où les femmes sont structurellement sous-représentées, n'appelle pas les mêmes choix de métriques qu'un modèle de scoring de crédit dans le secteur bancaire. AuditIQ facilite l'audit, mais il ne remplace pas le jugement humain. Cette nuance est fondamentale et doit être communiquée avec honnêteté aux utilisateurs — ce que l'outil fait explicitement.

La quatrième implication, peut-être la plus inattendue, concerne le rôle de l'IA générative dans la conformité. J'ai tenté d'atténuer ce risque en encadrant les prompts et en présentant les recommandations comme des suggestions à valider, mais cette question mérite un travail de recherche dédié.

### **5.2.2 Contributions à la littérature**

Ce travail apporte trois contributions au champ de recherche sur la fairness algorithmique et la conformité réglementaire.

D'abord, il documente empiriquement les besoins et les freins des PME françaises face à la question des biais IA. Les données du sondage et des entretiens, même modestes en volume, comblent une lacune identifiée dans plusieurs revues systématiques récentes.

Ensuite, il propose une architecture technique concrète pour un outil d'audit de fairness orienté PME, aligné sur l'AI Act. Les choix architecturaux (la couche de traduction métriques-réglementation, le système de feux tricolores, l'intégration de l'IA générative pour les recommandations) peuvent inspirer d'autres projets similaires.

Enfin, il met en lumière le concept de « triple interface » — utilisateur, réglementaire, cognitive — comme cadre d'analyse du fossé entre les outils de fairness existants et les besoins des non-spécialistes. Ce cadre pourrait être utile pour évaluer d'autres outils de conformité IA à l'avenir.

## **5.3 Recommandations**

### **5.3.1 Pour les PME**

**Commencer par cartographier ses usages IA.** Avant même de parler de biais, une PME doit savoir quels systèmes d'IA elle utilise et dans quels processus décisionnels. Mon enquête montre que cette cartographie n'est souvent pas faite — certains répondants découvraient pendant le sondage que leur outil de scoring était un « système d'IA » au sens de l'AI Act.

**Évaluer la criticité de chaque usage.** L'AI Act distingue les systèmes à haut risque des autres. Comprendre cette distinction permet de hiérarchiser les efforts de conformité.

**Utiliser un outil d'audit de fairness, même imparfait.** L'ennemi de la conformité n'est pas l'imperfection des outils — c'est l'inaction. Il crée une trace documentée de la démarche, identifie les risques les plus flagrants, et constitue un premier pas vers la conformité.

**Documenter sa démarche.** L'AI Act exige une documentation des mesures prises pour évaluer et atténuer les risques de biais. Même si l'entreprise ne parvient pas à corriger tous les biais identifiés, le fait de pouvoir montrer qu'elle les a évalués, qu'elle en a mesuré l'ampleur, et qu'elle a mis en place un plan de remédiation est un élément de conformité à part entière.

**Profiter des bacs à sable réglementaires.** Dès que les bacs à sable de l'article 57 seront opérationnels dans les États membres (échéance août 2026), les PME devraient s'y inscrire en priorité. L'accès est gratuit, la guidance est personnalisée, et les participants bénéficient d'une protection contre les amendes s'ils agissent de bonne foi.

**Désigner un référent IA interne.** Même dans une petite structure, identifier une personne responsable des sujets IA — ne serait-ce que pour centraliser la veille réglementaire et les décisions — réduit considérablement l'isolement décisionnel identifié dans mes entretiens. Il doit simplement être la personne qui s'assure que les bonnes questions sont posées.

**Former les équipes aux fondamentaux.** La formation ne doit pas viser à transformer les collaborateurs en data scientists, mais à leur donner le vocabulaire et les réflexes nécessaires pour interagir avec les systèmes d'IA de manière critique. Comprendre la différence entre corrélation et causalité, savoir ce qu'est un biais de sélection, être capable de questionner les résultats d'un algorithme — ces compétences de base sont accessibles en quelques heures de formation et peuvent transformer le rapport d'une PME à ses outils d'IA.

### **5.3.2 Pour les décideurs politiques et les régulateurs**

**Investir dans la sensibilisation des PME.** Mon enquête montre que le premier obstacle n'est pas technique mais cognitif : 38 % des répondants ne savent pas ce qu'est un biais algorithmique. Le modèle des « ateliers RGPD » organisés par la CNIL en 2018-2019 pourrait être répliqué pour l'AI Act.

**Développer des guides pratiques sectoriels.** Les obligations de l'AI Act sont formulées de manière générale et abstraite. L'ISACA a commencé ce travail avec son cadre d'audit IA (2024), mais il reste trop générique pour être directement opérationnel pour une PME.

**Soutenir financièrement les outils open source d'audit.** Plutôt que de laisser chaque PME réinventer la roue, les pouvoirs publics pourraient financer le développement et la maintenance d'outils d'audit de fairness accessibles, à l'image de ce qu'a fait le gouvernement néerlandais avec Algorithm Audit. Un investissement de quelques centaines de milliers d'euros pourrait bénéficier à des milliers d'entreprises. Un ratio coût-bénéfice difficilement égalable par des approches individuelles.

**Créer un label ou une certification « IA responsable » pour les PME.** Un mécanisme de certification allégé, adapté aux moyens des PME, permettrait de valoriser les entreprises qui font l'effort de la conformité. Ce label pourrait être un critère dans les marchés publics et dans les relations B2B, créant une incitation économique positive à l'adoption de pratiques de fairness.

### **5.3.3 Pour les recherches futures**

Ce travail ouvre plus de pistes qu'il n'en referme. J'en retiens cinq, classées de la plus technique à la plus institutionnelle, que je propose comme prolongements directs.

**Intégrer AuditIQ aux bacs à sable réglementaires de l'AI Act.** L'article 57 du règlement impose aux États membres de mettre en place, d'ici août 2026, des environnements d'expérimentation (*regulatory sandboxes*) où les PME pourront tester leurs systèmes d'IA sous le contrôle bienveillant d'une autorité de supervision. AuditIQ aurait vocation à être proposé comme outil standardisé dans ces bacs à sable. Ce qui permettrait à la fois d'élargir drastiquement sa base d'utilisateurs et de faire remonter aux régulateurs des données sur les pratiques réelles des PME. Une recherche future pourrait documenter ce que produit un tel couplage outil-sandbox, en termes de taux d'adoption, de qualité des audits et de charge pour le régulateur.

**Étendre le Module 3 aux LLM open-weight auto-hébergés.** La version actuelle du Module 3 fonctionne sur des API distantes (ChatGPT, Claude, Gemini, Mistral API). Une étude comparative des biais entre grandes familles de modèles open-weight (Mistral, Llama, Qwen, Falcon) via un framework commun serait un apport direct à la littérature, dans la lignée de *HELM* ou de *BIG-bench* mais spécifiquement calibrée sur les catégories protégées du droit européen.

**Adapter AuditIQ à d'autres juridictions européennes.** L'ancrage français d'AuditIQ (Code du travail L.1132-1, CNIL, Défenseur des droits, ACPR) est une force pour les PME françaises, mais une limite pour les autres marchés européens. Une recherche comparée — par exemple, comment transposer la couche d'ancrage juridique au droit allemand (AGG), néerlandais (*Awgb*), italien (décret législatif 2003/215) ou belge — serait précieuse. Elle permettrait de tester l'hypothèse selon laquelle la triple interface est stable tandis que seule la troisième interface (réglementaire) doit être reconfigurée nationalement. Cela rejoint les questions posées par Hacker (2023) sur l'articulation entre AI Act et droits nationaux de la non-discrimination.

**Conduire une étude longitudinale d'usage par les PME.** Mon évaluation utilisateur est ponctuelle, sur une session d'une heure. Ce type d'étude est le chaînon manquant entre la démonstration de faisabilité (ce que fait ce mémoire) et la démonstration d'impact (ce que ne fait aucun outil du domaine à ma connaissance).

**Soumettre AuditIQ à une validation par un panel juridique CNIL / Défenseur des droits.** La couche réglementaire du Module 2 et du Module 3 repose sur ma lecture personnelle du droit, croisée avec la doctrine publiée. Cette validation par un panel extérieur est à la fois une garantie pour les utilisateurs et une source de données qualitatives pour une publication académique sur la traduction du droit en interfaces logicielles — un champ émergent à la croisée du *legal design*, de l'IHM et de la recherche juridique appliquée.

Ces cinq pistes ne sont pas exhaustives. Je reste pour ma part engagé à faire vivre AuditIQ comme un projet open source, et à accueillir les contributions qui iraient dans ces directions.

## **5.4 Réflexion personnelle et DevPCP**

Ce projet a été, sans exagération, le plus formateur de mon cursus. Ce qui m'a le plus marqué, c'est la confrontation entre la théorie et le terrain.

### **5.4.1 Évolution de ma compréhension du problème**

Quand j'ai commencé ce projet, j'avais une vision assez abstraite des biais algorithmiques : un problème technique, avec des métriques à calculer et des algorithmes à appliquer. C'est le décalage entre la sophistication de la littérature académique et la réalité d'un CTO qui n'a jamais entendu le mot « fairness » dans un contexte algorithmique.

J'ai aussi appris les limites de ce qu'un MVP peut accomplir. Derrière chaque « solution technique », il y a des hypothèses normatives qu'il faut expliciter.

Un moment charnière de ce projet a été la lecture de l'article de Wachter, Mittelstadt et Russell sur l'impossibilité d'automatiser la fairness. Leur argumentation m'a obligé à repenser le rôle même d'AuditIQ : non pas un juge automatisé de la fairness, mais un assistant qui aide les humains à poser les bonnes questions. Ce repositionnement, qui peut sembler subtil, a eu des conséquences concrètes sur le design de l'outil. Par exemple, le choix de ne jamais afficher un verdict binaire (« conforme » / « non conforme ») mais toujours un gradient de risque accompagné d'explications.

### **5.4.2 Compétences développées**

Sur le plan du développement professionnel, ce projet m'a permis de développer des compétences transversales que je n'avais pas anticipées.

**Compétences techniques.** Le développement full-stack d'une plateforme SaaS en solo m'a confronté à l'ensemble de la chaîne de valeur technique : architecture backend (FastAPI, SQLAlchemy, design d'API REST), frontend moderne (Next.js, TypeScript, state management avec Zustand), data science appliquée (Fairlearn, Pandas, métriques statistiques), DevOps (Docker, CI/CD, déploiement multi-services), et sécurité (JWT, OAuth2, CORS, rate limiting). L'expérience m'a montré que la vraie difficulté n'est pas de maîtriser chaque technologie individuellement, mais de les faire fonctionner ensemble de manière cohérente.

**Compétences en recherche.** La conduite d'enquêtes et d'entretiens, l'analyse thématique selon la méthode de Braun et Clarke, la triangulation des données quantitatives et qualitatives — autant de compétences méthodologiques que je n'avais jamais pratiquées en contexte réel. La rédaction de la revue de littérature m'a aussi enseigné la rigueur de la recherche documentaire : distinguer une source primaire d'une source secondaire, évaluer la fiabilité d'une étude, et surtout ne pas confondre ce que la littérature dit effectivement avec ce qu'on voudrait qu'elle dise.

**Compétences en communication.** Expliquer les biais algorithmiques à des professionnels non techniciens m'a appris à adapter mon discours. Avec le recul, je me dis que cette compétence de « traduction » entre le monde technique et le monde métier est celle qui sera la plus directement transférable dans ma future carrière.

**Gestion de projet en solo.** Mener un projet de cette envergure seul implique de tenir tous les rôles : chef de projet, développeur, designer, chercheur, rédacteur. Une leçon essentielle pour quiconque veut livrer un produit plutôt qu'un prototype éternel.

### **5.4.3 Difficultés rencontrées et leçons tirées**

La plus grande difficulté a été la collecte de données. Le taux de refus élevé m'a fait prendre conscience de la réalité du chercheur de terrain : les données ne viennent pas à vous, il faut aller les chercher.

Une autre difficulté, plus technique, a concerné l'intégration entre le frontend et le backend. J'ai dû implémenter un système de requêtes asynchrones avec indicateurs de progression, ce qui s'est révélé plus complexe que prévu en raison de la gestion des états d'erreur et des timeouts.

Enfin, le dimensionnement du projet lui-même a été un défi. Chaque « non » a été douloureux, mais nécessaire pour livrer un MVP fonctionnel plutôt qu'un prototype inachevé.

### **5.4.4 Dimension collective et perspectives**

Ce mémoire est un travail individuel, mais le projet qu'il décrit n'aurait pas été possible sans un écosystème collectif. Le code de Fairlearn, développé par des dizaines de contributeurs bénévoles, est le socle sur lequel repose AuditIQ. Les études de cas publiées par Algorithm Audit et LangBiTe m'ont montré la voie. Et les 34 répondants au sondage m'ont donné accès à une réalité de terrain que je n'aurais pas pu inventer.

À plus long terme, je souhaite explorer la possibilité de structurer AuditIQ en un projet porté par une communauté, peut-être sous l'égide d'une fondation ou d'un consortium, à l'image de ce que fait la Linux Foundation avec Fairlearn. L'enjeu est de garantir la pérennité de l'outil au-delà de mon engagement individuel, et de le faire évoluer en fonction des retours des utilisateurs et de l'évolution du cadre réglementaire.

## **5.5 Conclusion générale**

Mais ce projet démontre qu'on peut réduire considérablement la distance entre l'état de l'art et la réalité des PME. Et l'écosystème technologique — Fairlearn, les API d'IA générative, les plateformes cloud à bas coût — rend cette ambition réalisable à l'échelle.

La route est encore longue. Et des questions de fond — comment articuler protection des données et détection des biais, comment choisir la « bonne » métrique de fairness dans chaque contexte — restent ouvertes.

Mais le premier pas est fait. La suite dépendra de la volonté collective — celle des entreprises, des régulateurs, et des développeurs d'outils — de transformer les bonnes intentions en pratiques concrètes.

Je tiens à remercier ceux qui ont contribué à ce projet — les 34 répondants au sondage, les personnes qui ont accepté de m'accorder du temps pour les entretiens, mes encadrants académiques, et la communauté open source de Fairlearn dont le travail constitue la colonne vertébrale technique d'AuditIQ. Ce mémoire est le fruit de leurs contributions autant que du mien.

Ce Consulting Project touche à sa fin, mais le projet AuditIQ ne s'arrête pas avec la soutenance. Et ça, aucune PME ne devrait pouvoir se permettre de l'ignorer.

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

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnMAAAFhCAYAAAAbRiwDAAAWw0lEQVR4Xu3dC6xsV1nA8d2WNyhFCAFFkYcGRQWVgEggFQ1QEI3RAkYqL8VaQFREHpEWElSwPHxEUFQUq8gjhYhKi0WiGBUUfBAFDQoGFKEQKW3phRJyXMtZi7Put2ZO596795kze36/5J/Zs2bOw9s9a393zrk4DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwPV6SeldYuyTcB7bfD6Y+ENZeEe4DcMTtpV5VbrP7pF5Ubi8qa/+S+rpyDBxtPz4sXs+fK7dVPn5pWMvPqY+1twBsiSek/rW5f1bqSal7l/t/kfrS1EfrE4CtUoezD6bOLcdPTl1ejv+w3NbnPb3cArAlXpZ6fXP/Z8tt3thzNyi37RqwHf4x9Z/lOL9271mOH1Du1/WrUo8vx/U177UOsCWemnpzc//RzXH2xNTFqaek7lbWfucLjwJH1edT/9Tc/0TqfuX4u1Lvax7LbjIsPuaKcv/81F33HwbgqLr1sP838Aembtg8ltXHnpW6czl+XbkFjqYrh8Vfwlo/P+y/dt86LP6C1qqv9c+W2/wrGPcoxwAccceG5T9Wye/YndPcX/Yc4Oipr9X4ml22luV37N5djm8/LN6hi88BAAAAAAAAAAAAAAAAgJHtfeD79yRJ0ikX/6eA4HAsORklSdLJ9sFHPTJea2FS3UkoSZJOtY/E6y1MZskJKEmSTrX/eFT7/0YTptOdfJIkaZTiNRcmEU88SZI0XvG6C6OLJ50kSRqveN2F0cWTTpIkjVe87sLo4kknSZJG7CMPv1m89sKoupNOkiSN10fPvXm89sKoupNOkiSNl2GOqXUnnSRJGi/DHFPrTjpJkjRehjmm1p10kiRpvAxzTK076SRJ0ngZ5phad9JJkqTxMswxte6kkyRJ42WYY2rdSSdJksbLMMfUupNOkiSNl2GOqXUnnSRJGi/DHFPrTjpJkjRehjmm1p10kiRpvAxzTK076SRJ0ngZ5phad9JJkqTxMswdCW9L7TX32+NTMdbnqc4dTuJzdiedJEkaL8PckZCHuXen7lDun/DAdJR1J50kSRqv1cPcc5ru2qy/KvWnzf3ot1I/1tz/xLCYTV7UrM1qVhnDn6VuN+z/wcR36Wrt2nXl9h3NeuthQ/8xyz5PrT6/Pn5heDxrj1/b3P+usrZUd9JJkqTxWj3MnVW6IvXMspav27dJnVaOo7x2Zrl9dLPW3j459YpyTJHfmbtn6srUXYb9P6x7pa4ux9+X+pdy3P7hL/sPUS177D2p+5fj+vidmuP8Hzxa9vWWfe6lupNOkiSN1+phLvto6rLm/rJr+jLPS725HMdr/0Eft7PyMPct5Tj/AdU/pItTLy7H9bH2Nh5H8Xm1BzdrVT3Ow15247LWfj9ZPc4/Eo6PLdWddJIkabxWD3N3H/av1Wc063Xt9GYtitf+f0i9f1j8NDH/RC6/2ZTXn9E8b6e1w9yHhv0/wAelPlaOH5J6bzmOf8Cr1Mfy26SvKcdvH9Yb5pY9Fo+zy0srdSedJEkar9XD3NHH/973oArzsflHpS3q7X6jhzmXl6Oo/l5J/9aOf5PxvePwu39Vjy3LJs9yz45p6pvKcfuPV8snyUrdSSdJksbr+oe5lw/7f8nsdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsg/8DVZ773G9KIBQAAAABJRU5ErkJggg==>
