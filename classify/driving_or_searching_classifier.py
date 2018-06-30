from utils.carpool_data import posts
from clean_tokens.process import process, stage3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer

def analyzer(text):
	stage3(process(text))

count_vect = CountVectorizer(analyzer = analyzer)

#the training set of posts for number of routes
#in particular, the classified posts for number of routes
posts_tr_dos = posts[~posts["driving_or_searching"].isnull()].reset_index(drop = True)

X_count = count_vect.fit_transform(posts_tr_dos["message"])
X_count_feat = pd.DataFrame(X_count.toarray())
Y = posts_tr_dos["driving_or_searching"]


def dos_classifier(message):
    rf = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1)
    rf_model = rf.fit(X_count_feat,Y)
    X = count_vect.fit(posts_tr_dos["message"])
    message_turn_vector = X.transform([message])
    return rf_model.predict(message_turn_vector)
