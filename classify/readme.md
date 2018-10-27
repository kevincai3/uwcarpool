
## Search Parameters

Each Facebook post is classified by whether it contains a carpool(s), and if so, whether it is a driving or searching carpool(s), the origin(s), the destination(s) and the date of the carpool(s).

## Data Preprocessing:

In order to effectively search a Facebook post, it must be "cleaned" first. This is done via spellcheck, lemmatizing, removing stopwords (except for the words "to" and "from"), converting specific names to a standard form and converting certain punctuation symbols to words (for example "->" is converted to "to").

## Driving, Searching and Other Classification

Discovering whether a post is a "driving" post (a carpool is being offered), a "searching" post (a carpool is being requested) or an "other" post (a completetly unrelated post) is a trinary classification problem. As such, a supervised learning algorthm is used.

The training data consists 1366 manually classified posts. Below is a preview of the data where "post_type" is the classification and "stage_3" is the processed text.


```python
import pandas as pd
from db import engine
derived_posts = pd.read_sql_query('SELECT * from derived_posts', con=engine)

data = pd.read_sql_query('SELECT A.post_id, A.post_type, A.route_count, B.stage_3 FROM manual_posts A LEFT JOIN derived_posts B ON (A.post_id = B.post_id) ', con=engine)
data[["post_type", "stage_3"]].head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>post_type</th>
      <th>stage_3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>d</td>
      <td>driving,waterloo,to,markham,sunday,may,27,at,3...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>d</td>
      <td>driving,toronto,to,waterloo,sunday,may,27th,at...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>d</td>
      <td>leaving,waterloo,to,toronto,7pm,today</td>
    </tr>
    <tr>
      <th>3</th>
      <td>d</td>
      <td>driving,scarborough,to,waterloo,at,8am,monday,...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>d</td>
      <td>driving,fairview,mall,to,waterloo,sunday,may,2...</td>
    </tr>
  </tbody>
</table>
</div>




```python
import nltk
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import GridSearchCV

def split_by_comma(x):
    return x.split(",")
```

The classifier used is the random forest classifier, due its reputation of being robust to overfitting. A grid search cross validation is performed to find the optimal parameters and the optimal vectorizor for the text.  The grid search is performed over n_estimators = 50, 150, 300; max_depth = 60, 90, None; bootstrap = True, False; and the TFIDF, count and 2-gram vectorizers.


```python
rf = RandomForestClassifier()
param = {'n_estimators': [50, 150,300], 'max_depth': [60,90,None], 'bootstrap': ['True','False']}
gs = GridSearchCV(rf, param, cv = 5, n_jobs = -1, return_train_score= True)
```

Using the TFIDF vectorizer:


```python
tfidf_vect = TfidfVectorizer(analyzer = split_by_comma)
X_tfidf = tfidf_vect.fit_transform(data["stage_3"])
X_tfidf_feat = pd.DataFrame(X_tfidf.toarray())
gs_fit_tfidf = gs.fit(X_tfidf_feat, data["post_type"])
pd.set_option('display.max_colwidth', -1)
pd.DataFrame(gs_fit_tfidf.cv_results_).sort_values(by = "rank_test_score")[["params","mean_test_score", "std_test_score", "mean_fit_time", "std_fit_time", "mean_score_time", "std_score_time"]]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>params</th>
      <th>mean_test_score</th>
      <th>std_test_score</th>
      <th>mean_fit_time</th>
      <th>std_fit_time</th>
      <th>mean_score_time</th>
      <th>std_score_time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>10</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.975842</td>
      <td>0.010438</td>
      <td>0.535766</td>
      <td>0.118265</td>
      <td>0.017554</td>
      <td>0.001352</td>
    </tr>
    <tr>
      <th>1</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.974378</td>
      <td>0.011762</td>
      <td>0.557508</td>
      <td>0.095647</td>
      <td>0.018151</td>
      <td>0.001163</td>
    </tr>
    <tr>
      <th>4</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.973646</td>
      <td>0.010113</td>
      <td>0.600394</td>
      <td>0.039336</td>
      <td>0.018950</td>
      <td>0.001092</td>
    </tr>
    <tr>
      <th>13</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.973646</td>
      <td>0.015869</td>
      <td>0.498069</td>
      <td>0.135294</td>
      <td>0.017952</td>
      <td>0.001092</td>
    </tr>
    <tr>
      <th>14</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.972914</td>
      <td>0.007480</td>
      <td>1.022864</td>
      <td>0.110984</td>
      <td>0.060039</td>
      <td>0.019790</td>
    </tr>
    <tr>
      <th>11</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.972914</td>
      <td>0.010444</td>
      <td>1.159101</td>
      <td>0.227544</td>
      <td>0.064029</td>
      <td>0.026987</td>
    </tr>
    <tr>
      <th>17</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.972182</td>
      <td>0.009634</td>
      <td>1.092479</td>
      <td>0.169919</td>
      <td>0.052660</td>
      <td>0.009301</td>
    </tr>
    <tr>
      <th>2</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.971449</td>
      <td>0.012075</td>
      <td>1.086494</td>
      <td>0.214378</td>
      <td>0.056849</td>
      <td>0.014397</td>
    </tr>
    <tr>
      <th>5</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.971449</td>
      <td>0.012926</td>
      <td>1.055578</td>
      <td>0.125692</td>
      <td>0.072806</td>
      <td>0.017262</td>
    </tr>
    <tr>
      <th>7</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.971449</td>
      <td>0.013303</td>
      <td>0.521007</td>
      <td>0.170913</td>
      <td>0.018750</td>
      <td>0.001465</td>
    </tr>
    <tr>
      <th>8</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.970717</td>
      <td>0.011512</td>
      <td>0.942878</td>
      <td>0.202430</td>
      <td>0.062035</td>
      <td>0.019291</td>
    </tr>
    <tr>
      <th>3</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.969253</td>
      <td>0.011860</td>
      <td>0.323335</td>
      <td>0.093084</td>
      <td>0.007780</td>
      <td>0.000746</td>
    </tr>
    <tr>
      <th>6</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.968521</td>
      <td>0.015562</td>
      <td>0.304985</td>
      <td>0.113919</td>
      <td>0.008377</td>
      <td>0.001739</td>
    </tr>
    <tr>
      <th>12</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.967789</td>
      <td>0.013707</td>
      <td>0.282045</td>
      <td>0.151110</td>
      <td>0.007381</td>
      <td>0.001017</td>
    </tr>
    <tr>
      <th>16</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.967057</td>
      <td>0.015472</td>
      <td>0.727256</td>
      <td>0.135528</td>
      <td>0.017953</td>
      <td>0.000630</td>
    </tr>
    <tr>
      <th>15</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.967057</td>
      <td>0.015472</td>
      <td>0.466153</td>
      <td>0.120829</td>
      <td>0.007381</td>
      <td>0.001016</td>
    </tr>
    <tr>
      <th>0</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.966325</td>
      <td>0.020145</td>
      <td>0.294811</td>
      <td>0.077640</td>
      <td>0.008378</td>
      <td>0.000798</td>
    </tr>
    <tr>
      <th>9</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.962665</td>
      <td>0.011818</td>
      <td>0.296607</td>
      <td>0.100825</td>
      <td>0.008578</td>
      <td>0.001620</td>
    </tr>
  </tbody>
</table>
</div>



Using the count vectorizer:


```python
count_vect = CountVectorizer(analyzer = split_by_comma)
X_count = count_vect.fit_transform(data["stage_3"])
X_count_feat= pd.DataFrame(X_count.toarray())
gs_fit_count = gs.fit(X_count_feat, data["post_type"])
pd.DataFrame(gs_fit_count.cv_results_).sort_values(by = "rank_test_score")[["params","mean_test_score", "std_test_score", "mean_fit_time", "std_fit_time", "mean_score_time", "std_score_time"]]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>params</th>
      <th>mean_test_score</th>
      <th>std_test_score</th>
      <th>mean_fit_time</th>
      <th>std_fit_time</th>
      <th>mean_score_time</th>
      <th>std_score_time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>9</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.980234</td>
      <td>0.006321</td>
      <td>0.215823</td>
      <td>0.068382</td>
      <td>0.007978</td>
      <td>0.001261</td>
    </tr>
    <tr>
      <th>11</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.977306</td>
      <td>0.007751</td>
      <td>1.070338</td>
      <td>0.230143</td>
      <td>0.075200</td>
      <td>0.023522</td>
    </tr>
    <tr>
      <th>13</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.976574</td>
      <td>0.005871</td>
      <td>0.597003</td>
      <td>0.127303</td>
      <td>0.018950</td>
      <td>0.001669</td>
    </tr>
    <tr>
      <th>2</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.975842</td>
      <td>0.003659</td>
      <td>0.893611</td>
      <td>0.073811</td>
      <td>0.043685</td>
      <td>0.007527</td>
    </tr>
    <tr>
      <th>5</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.975842</td>
      <td>0.009650</td>
      <td>0.910566</td>
      <td>0.180324</td>
      <td>0.070014</td>
      <td>0.023889</td>
    </tr>
    <tr>
      <th>14</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.975842</td>
      <td>0.008155</td>
      <td>1.026256</td>
      <td>0.149465</td>
      <td>0.064427</td>
      <td>0.034499</td>
    </tr>
    <tr>
      <th>17</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.975110</td>
      <td>0.005802</td>
      <td>0.947466</td>
      <td>0.211509</td>
      <td>0.046875</td>
      <td>0.013307</td>
    </tr>
    <tr>
      <th>1</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.975110</td>
      <td>0.006225</td>
      <td>0.493879</td>
      <td>0.108622</td>
      <td>0.023937</td>
      <td>0.009031</td>
    </tr>
    <tr>
      <th>4</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.975110</td>
      <td>0.006638</td>
      <td>0.450794</td>
      <td>0.105920</td>
      <td>0.017554</td>
      <td>0.001018</td>
    </tr>
    <tr>
      <th>7</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.975110</td>
      <td>0.008707</td>
      <td>0.500062</td>
      <td>0.114804</td>
      <td>0.024136</td>
      <td>0.010896</td>
    </tr>
    <tr>
      <th>15</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.974378</td>
      <td>0.008589</td>
      <td>0.322737</td>
      <td>0.122386</td>
      <td>0.008379</td>
      <td>0.000799</td>
    </tr>
    <tr>
      <th>8</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.974378</td>
      <td>0.008589</td>
      <td>0.866882</td>
      <td>0.152274</td>
      <td>0.040293</td>
      <td>0.006722</td>
    </tr>
    <tr>
      <th>16</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.974378</td>
      <td>0.008268</td>
      <td>0.559503</td>
      <td>0.082061</td>
      <td>0.018352</td>
      <td>0.000488</td>
    </tr>
    <tr>
      <th>6</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.974378</td>
      <td>0.009465</td>
      <td>0.204254</td>
      <td>0.037122</td>
      <td>0.016955</td>
      <td>0.019461</td>
    </tr>
    <tr>
      <th>3</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.973646</td>
      <td>0.006222</td>
      <td>0.233177</td>
      <td>0.072729</td>
      <td>0.008178</td>
      <td>0.000977</td>
    </tr>
    <tr>
      <th>10</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.972182</td>
      <td>0.008163</td>
      <td>0.440023</td>
      <td>0.052985</td>
      <td>0.017753</td>
      <td>0.000399</td>
    </tr>
    <tr>
      <th>12</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.969985</td>
      <td>0.008086</td>
      <td>0.321541</td>
      <td>0.097769</td>
      <td>0.008577</td>
      <td>0.001017</td>
    </tr>
    <tr>
      <th>0</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.969985</td>
      <td>0.008717</td>
      <td>0.213629</td>
      <td>0.065307</td>
      <td>0.008179</td>
      <td>0.000977</td>
    </tr>
  </tbody>
</table>
</div>



Using the 2-gram vectorizer.


```python
#putting tockenized sentence back into a sentence with spaces for ngrams
data_ngram = data["stage_3"].apply(lambda x: x.replace(","," "))
gram2_vect = CountVectorizer(ngram_range = (2,2))
X_gram2 = gram2_vect.fit_transform(data_ngram)
X_gram2_feat= pd.DataFrame(X_gram2.toarray())
gs_fit_gram2 = gs.fit(X_gram2_feat, data["post_type"])
pd.DataFrame(gs_fit_gram2.cv_results_).sort_values(by = "rank_test_score")[["params","mean_test_score", "std_test_score", "mean_fit_time", "std_fit_time", "mean_score_time", "std_score_time"]]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>params</th>
      <th>mean_test_score</th>
      <th>std_test_score</th>
      <th>mean_fit_time</th>
      <th>std_fit_time</th>
      <th>mean_score_time</th>
      <th>std_score_time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.956808</td>
      <td>0.018314</td>
      <td>3.068197</td>
      <td>0.615909</td>
      <td>0.118284</td>
      <td>0.026765</td>
    </tr>
    <tr>
      <th>17</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.956076</td>
      <td>0.012339</td>
      <td>6.344037</td>
      <td>1.439371</td>
      <td>0.228588</td>
      <td>0.107978</td>
    </tr>
    <tr>
      <th>11</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.955344</td>
      <td>0.016146</td>
      <td>6.198428</td>
      <td>1.031843</td>
      <td>0.301794</td>
      <td>0.062833</td>
    </tr>
    <tr>
      <th>5</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.955344</td>
      <td>0.011522</td>
      <td>6.470898</td>
      <td>1.017932</td>
      <td>0.261103</td>
      <td>0.060348</td>
    </tr>
    <tr>
      <th>14</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.953880</td>
      <td>0.011582</td>
      <td>6.572427</td>
      <td>0.864169</td>
      <td>0.291821</td>
      <td>0.080401</td>
    </tr>
    <tr>
      <th>8</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.953880</td>
      <td>0.013867</td>
      <td>6.584395</td>
      <td>1.157486</td>
      <td>0.288627</td>
      <td>0.076094</td>
    </tr>
    <tr>
      <th>2</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.953880</td>
      <td>0.014055</td>
      <td>6.302748</td>
      <td>1.028051</td>
      <td>0.312365</td>
      <td>0.104313</td>
    </tr>
    <tr>
      <th>16</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.953148</td>
      <td>0.012423</td>
      <td>3.130630</td>
      <td>0.281382</td>
      <td>0.116090</td>
      <td>0.026647</td>
    </tr>
    <tr>
      <th>12</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.953148</td>
      <td>0.011982</td>
      <td>1.622660</td>
      <td>0.350298</td>
      <td>0.022142</td>
      <td>0.004434</td>
    </tr>
    <tr>
      <th>13</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.953148</td>
      <td>0.013836</td>
      <td>3.196853</td>
      <td>0.738712</td>
      <td>0.124269</td>
      <td>0.034176</td>
    </tr>
    <tr>
      <th>15</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.951684</td>
      <td>0.013816</td>
      <td>2.040942</td>
      <td>0.175767</td>
      <td>0.023339</td>
      <td>0.001492</td>
    </tr>
    <tr>
      <th>7</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.950220</td>
      <td>0.013058</td>
      <td>3.115069</td>
      <td>0.381635</td>
      <td>0.113896</td>
      <td>0.023546</td>
    </tr>
    <tr>
      <th>9</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.950220</td>
      <td>0.012254</td>
      <td>1.600520</td>
      <td>0.134794</td>
      <td>0.023338</td>
      <td>0.001492</td>
    </tr>
    <tr>
      <th>6</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.949488</td>
      <td>0.017227</td>
      <td>1.584763</td>
      <td>0.116020</td>
      <td>0.024136</td>
      <td>0.001828</td>
    </tr>
    <tr>
      <th>10</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.949488</td>
      <td>0.014201</td>
      <td>2.927175</td>
      <td>0.473662</td>
      <td>0.106715</td>
      <td>0.030527</td>
    </tr>
    <tr>
      <th>1</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.948023</td>
      <td>0.013022</td>
      <td>2.949113</td>
      <td>0.555145</td>
      <td>0.111503</td>
      <td>0.018662</td>
    </tr>
    <tr>
      <th>3</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.948023</td>
      <td>0.016454</td>
      <td>1.733363</td>
      <td>0.173790</td>
      <td>0.025533</td>
      <td>0.001353</td>
    </tr>
    <tr>
      <th>0</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.948023</td>
      <td>0.011041</td>
      <td>1.108437</td>
      <td>0.342421</td>
      <td>0.023139</td>
      <td>0.001323</td>
    </tr>
  </tbody>
</table>
</div>



The mean test score score is essentially 97% for both the TFIDF and count vectorizers and 95% for the 2-gram vectorizer. Due to the negligable difference in accuracy and efficiency, the simplest model (count vectorizer with n_estimators = 60, max_depth = 10 and boostrap = True) is chosen.


```python
model = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1).fit(X_count_feat,data["post_type"])
```

Due to significant imbalance in the class distribution (in particular, there is a lack of "other" posts as seen in the histogram below), it is important to check where the model is failing. 


```python
data["post_type"].value_counts().plot(kind="bar")
```




    <matplotlib.axes._subplots.AxesSubplot at 0x1d3ae867da0>



Below is a list displaying the number of times a "searching", "other" and "driving" post was misclassified.


```python
data[model.predict(X_count_feat) != data["post_type"]]["post_type"].value_counts()
```




    o    8
    s    7
    d    5
    Name: post_type, dtype: int64



The percentage of misclassified "other" posts is


```python
8/sum(data["post_type"] == "o")
```




    0.6153846153846154



So the model has trouble classifying "other" posts.

One way to solve this issue might be to try an undersampling method via a balanced random forest classifier. The same gridsearch crossvalidation as before (except with a count vectorizer and a balanced random forest classifier) is run.


```python
from imblearn.ensemble import BalancedRandomForestClassifier
brf = BalancedRandomForestClassifier()
gs = GridSearchCV(brf, param, cv = 5, n_jobs = -1, return_train_score= True)
gs_fit_count = gs.fit(X_count_feat, data["post_type"])
pd.DataFrame(gs_fit_count.cv_results_).sort_values(by = "rank_test_score")[["params","mean_test_score", "std_test_score", "mean_fit_time", "std_fit_time", "mean_score_time", "std_score_time"]]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>params</th>
      <th>mean_test_score</th>
      <th>std_test_score</th>
      <th>mean_fit_time</th>
      <th>std_fit_time</th>
      <th>mean_score_time</th>
      <th>std_score_time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>8</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.943631</td>
      <td>0.023546</td>
      <td>0.963424</td>
      <td>0.020095</td>
      <td>0.029720</td>
      <td>0.001163</td>
    </tr>
    <tr>
      <th>2</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.935578</td>
      <td>0.009347</td>
      <td>0.849528</td>
      <td>0.006226</td>
      <td>0.025732</td>
      <td>0.001323</td>
    </tr>
    <tr>
      <th>11</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 300}</td>
      <td>0.935578</td>
      <td>0.018848</td>
      <td>0.883039</td>
      <td>0.035880</td>
      <td>0.025731</td>
      <td>0.001597</td>
    </tr>
    <tr>
      <th>7</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.933382</td>
      <td>0.032809</td>
      <td>0.530980</td>
      <td>0.063094</td>
      <td>0.026928</td>
      <td>0.020730</td>
    </tr>
    <tr>
      <th>1</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.932650</td>
      <td>0.023888</td>
      <td>0.442616</td>
      <td>0.009018</td>
      <td>0.015161</td>
      <td>0.002476</td>
    </tr>
    <tr>
      <th>5</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.930454</td>
      <td>0.021927</td>
      <td>1.113423</td>
      <td>0.123250</td>
      <td>0.030518</td>
      <td>0.004165</td>
    </tr>
    <tr>
      <th>16</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 150}</td>
      <td>0.930454</td>
      <td>0.009026</td>
      <td>0.511233</td>
      <td>0.006070</td>
      <td>0.016157</td>
      <td>0.001717</td>
    </tr>
    <tr>
      <th>13</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.926061</td>
      <td>0.018013</td>
      <td>0.477323</td>
      <td>0.013390</td>
      <td>0.014561</td>
      <td>0.002720</td>
    </tr>
    <tr>
      <th>10</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 150}</td>
      <td>0.923865</td>
      <td>0.017511</td>
      <td>0.498866</td>
      <td>0.027082</td>
      <td>0.017553</td>
      <td>0.002792</td>
    </tr>
    <tr>
      <th>4</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 150}</td>
      <td>0.922401</td>
      <td>0.016190</td>
      <td>0.432443</td>
      <td>0.008239</td>
      <td>0.013564</td>
      <td>0.001621</td>
    </tr>
    <tr>
      <th>17</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 300}</td>
      <td>0.921669</td>
      <td>0.024762</td>
      <td>0.938490</td>
      <td>0.093934</td>
      <td>0.025732</td>
      <td>0.002631</td>
    </tr>
    <tr>
      <th>14</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 300}</td>
      <td>0.918741</td>
      <td>0.023692</td>
      <td>0.970405</td>
      <td>0.030733</td>
      <td>0.034707</td>
      <td>0.007501</td>
    </tr>
    <tr>
      <th>12</th>
      <td>{'bootstrap': 'False', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.909224</td>
      <td>0.037865</td>
      <td>0.181515</td>
      <td>0.023827</td>
      <td>0.006981</td>
      <td>0.001410</td>
    </tr>
    <tr>
      <th>0</th>
      <td>{'bootstrap': 'True', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.902635</td>
      <td>0.045875</td>
      <td>0.162166</td>
      <td>0.009240</td>
      <td>0.005785</td>
      <td>0.001163</td>
    </tr>
    <tr>
      <th>9</th>
      <td>{'bootstrap': 'False', 'max_depth': 60, 'n_estimators': 50}</td>
      <td>0.890922</td>
      <td>0.042588</td>
      <td>0.167551</td>
      <td>0.009853</td>
      <td>0.007581</td>
      <td>0.001353</td>
    </tr>
    <tr>
      <th>15</th>
      <td>{'bootstrap': 'False', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.887994</td>
      <td>0.037866</td>
      <td>0.210238</td>
      <td>0.017722</td>
      <td>0.009775</td>
      <td>0.003179</td>
    </tr>
    <tr>
      <th>6</th>
      <td>{'bootstrap': 'True', 'max_depth': None, 'n_estimators': 50}</td>
      <td>0.884334</td>
      <td>0.031298</td>
      <td>0.248934</td>
      <td>0.037208</td>
      <td>0.016157</td>
      <td>0.013869</td>
    </tr>
    <tr>
      <th>3</th>
      <td>{'bootstrap': 'True', 'max_depth': 90, 'n_estimators': 50}</td>
      <td>0.875549</td>
      <td>0.052126</td>
      <td>0.159572</td>
      <td>0.004460</td>
      <td>0.007780</td>
      <td>0.001162</td>
    </tr>
  </tbody>
</table>
</div>



The results are worse than before. The old results are satisfactory so we will use a standard random forest model for now. We may look into oversampling in the future.

## Route Detection:

The words "to" and "from" are words commonly used in carpooling posts. In our dataset the percentage of such posts is given below.


```python
sum([1 for x in derived_posts["stage_3"].tolist() if ("to" or "from") in split_by_comma(x)])/derived_posts.shape[0]
```




    0.9688260543519767



Due to the high occurence of posts with the words "to" and "from", the route detection algorithm uses the relative location of city names in the post, in terms of the words "to" and "from", to determine the origins and destinations of the trips in the post. 

## Duplicate Detection:

It is possible for duplicate messages to appear in the database. One way this can occur is if an individual posts the same post in 2 different Facebook groups. To deal with this, every time a post is read into the database, it is grouped with other duplicate posts up to one week in the past. When searched, only the most recent post in a duplicate group is displayed, along with all Facebook groups in which that post was posted.

## Trips:

It is possible for a post to contain multiple carpools. For example, the following post "Driving from Toronto to Mississauga to Waterloo", contains one carpool from Toronto to Mississauga, another from Mississauga to Waterloo and a final carpool from Toronto to Waterloo. Each such carpool is referred to as a trip. Once a post has been classified, it is mapped to multiple corresponding trips. It is this database of trips that the search engine queries.
