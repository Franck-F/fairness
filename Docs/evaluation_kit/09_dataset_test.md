# Dataset de test — Tâche 1

## Choix du dataset : Adult Census Income (UCI)

Justification :
- Déjà cité dans le mémoire, assure la cohérence narrative.
- Public, sous licence libre, largement utilisé dans la littérature fairness (référence de facto avec COMPAS et German Credit).
- Contient une variable sensible claire (`sex`) et une cible binaire (`income` ≥ 50k / < 50k) qui se prête à une métaphore RH « candidat retenu / non retenu ».
- Taille originale ~48 000 lignes : sous-échantillonnage nécessaire pour rester réactif en démo.

Source principale : UCI Machine Learning Repository.
URL : https://archive.ics.uci.edu/ml/datasets/adult
URL directe fichier : https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data

## Colonnes d'origine

```
age, workclass, fnlwgt, education, education-num, marital-status,
occupation, relationship, race, sex, capital-gain, capital-loss,
hours-per-week, native-country, income
```

## Préparation (script à exécuter avant la première session)

Enregistrer dans `datasets/prepare_recrutement_test.py` :

```python
import pandas as pd

COLS = [
    "age","workclass","fnlwgt","education","education_num",
    "marital_status","occupation","relationship","race","sex",
    "capital_gain","capital_loss","hours_per_week","native_country","income"
]

URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data"
df = pd.read_csv(URL, header=None, names=COLS, skipinitialspace=True, na_values="?")
df = df.dropna()

# Renommage "RH-friendly" pour la mise en scène de la tache
df = df.rename(columns={
    "age": "age_candidat",
    "education": "niveau_etudes",
    "hours_per_week": "heures_semaine",
    "sex": "sex",  # conservé pour clarté de la variable sensible
    "income": "decision_outil",
})
df["decision_outil"] = df["decision_outil"].map({">50K": "retenu", "<=50K": "non_retenu"})

# Sous-echantillonnage stratifie sur sex + decision pour garder la structure du biais
sample = (
    df.groupby(["sex","decision_outil"], group_keys=False)
      .apply(lambda g: g.sample(min(len(g), 1250), random_state=42))
)

sample.to_csv("recrutement_test.csv", index=False)
print(f"Fichier ecrit : {len(sample)} lignes")
```

Cible : environ 5000 lignes (plafond de 1250 par combinaison `sex × decision_outil`, quatre combinaisons).

## Vérification de la présence d'un biais

Le biais de genre est connu dans ce dataset : le taux de revenus > 50k est nettement plus élevé chez les hommes. Sur le sous-échantillon préparé, Franck doit vérifier **avant** les sessions que :

- Le taux de `decision_outil = retenu` chez `sex = Male` est supérieur d'au moins 15 points à celui chez `sex = Female`.
- Fairlearn et AuditIQ rapportent tous deux une `demographic_parity_difference` non nulle et non triviale.

Si ce n'est pas le cas (random seed différent, évolution de la source), régénérer jusqu'à obtenir un biais visible.

## Fichier attendu

| Champ | Valeur |
|-------|--------|
| Nom | `recrutement_test.csv` |
| Chemin | `Docs/evaluation_kit/datasets/recrutement_test.csv` |
| Séparateur | `,` |
| Encodage | UTF-8 |
| Lignes | ~5000 |
| Variable cible | `decision_outil` (retenu / non_retenu) |
| Variable sensible principale | `sex` |
| Variables sensibles secondaires | `race`, `age_candidat` |

## Alternative en français ?

Il n'existe **pas**, à la connaissance de l'auteur et au moment de la rédaction (avril 2026), de dataset français public, libre, équivalent à Adult Census Income avec variable sensible clairement exploitable pour une démonstration de fairness en contexte RH. Les initiatives de l'INSEE et de data.gouv.fr publient surtout des données agrégées, inadaptées à un audit ligne à ligne. Le choix du dataset UCI est donc assumé comme un compromis pragmatique. Les noms de colonnes sont traduits pour donner au testeur l'impression d'un cas d'usage français réaliste.

Pistes futures (non utilisées ici) :
- Dataset `French Employment` Kaggle (non officiel, qualité variable).
- Base Sirene + INSEE agrégats (non adaptée à la tâche individuelle).

## Script Fairlearn baseline (Tâche 2)

Enregistrer dans `datasets/fairlearn_baseline.py` :

```python
import pandas as pd
from fairlearn.metrics import (
    MetricFrame, selection_rate, demographic_parity_difference,
    demographic_parity_ratio
)

df = pd.read_csv("recrutement_test.csv")
y_true = (df["decision_outil"] == "retenu").astype(int)
# On considere la "decision de l'outil" comme la prediction
y_pred = y_true.copy()
sensitive = df["sex"]

mf = MetricFrame(
    metrics={"taux_selection": selection_rate},
    y_true=y_true, y_pred=y_pred, sensitive_features=sensitive,
)

print("=== Taux de selection par groupe ===")
print(mf.by_group)
print()
print("Demographic parity difference :",
      round(demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive), 4))
print("Demographic parity ratio      :",
      round(demographic_parity_ratio(y_true, y_pred, sensitive_features=sensitive), 4))
print()
print("Interpretation : plus la difference est grande, plus le biais est marque.")
```

Pré-requis : `pip install fairlearn pandas`.
