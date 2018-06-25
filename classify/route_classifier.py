from utils.carpool_data import posts
from clean_tokens.process import process, stage3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer

def analyzer(text):
	stage3(process(text))
	
def num_of_caps(string):
    return sum(1 for c in string if c.isupper())

count_vect = CountVectorizer(analyzer = analyzer)

X_count = count_vect.fit(posts_tr_routes["message"])
Y = posts_tr_routes["number_of_routes"]

def route_classifier(message):    
    message_turn_vect = X_count.transform([message])
    length = len(message)
    caps = num_of_caps(message)
    X_feat = numpy.append(message_turn_vect, length, caps)
    rf = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1)
    rf_model = rf.fit(X_feat,Y)
    return rf_model.predict(X_feat)
