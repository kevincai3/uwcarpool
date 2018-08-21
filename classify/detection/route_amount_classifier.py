import pandas as pd
import numpy as np
from scipy.sparse import hstack
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier

from db import engine

def analyzer(text):
    return text.split(",")
    #stage3(process(text))

def fetch_data():
    query = "SELECT post.id, post.message, derived.stage_3, manual.route_count FROM posts as post JOIN derived_posts AS derived ON derived.post_id = post.id JOIN manual_posts AS manual ON manual.post_id = post.id WHERE derived.stage_3 IS NOT NULL AND manual.route_count IS NOT NULL"
    posts = pd.read_sql_query(query, engine)
    return posts

def num_of_caps(string):
    return sum(1 for c in string if c.isupper())

def augment_message(word_vect, message):
    return hstack([word_vect, [[len(message)]], [[num_of_caps(message)]]])

def predict(model, vectorizer, message, processed_message):
    X_feat = augment_message(vectorizer.transform([processed_message]), message)
    return model.predict(X_feat)[0]

def train_model():
    data = fetch_data()
    word_vect = CountVectorizer(analyzer = analyzer)
    X_count = word_vect.fit_transform(data["stage_3"])
    X_count_feat = pd.DataFrame(X_count.toarray())
    X_count_feat["length"] = data["message"].apply(lambda x: len(x))
    X_count_feat["cap_num"] = data["message"].apply(lambda x: num_of_caps(x))
    Y = data["route_count"]

    rf = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1)
    rf_model = rf.fit(X_count_feat,Y)
    X = word_vect.fit(data["stage_3"])
    return rf_model, X

# count_vect = CountVectorizer(analyzer = analyzer)

# X_count = count_vect.fit(posts_tr_routes["message"])
# Y = posts_tr_routes["number_of_routes"]

# def route_classifier(message):
    # message_turn_vect = X_count.transform([message])
    # length = len(message)
    # caps = num_of_caps(message)
    # X_feat = numpy.append(message_turn_vect, length, caps)
    # rf = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1)
    # rf_model = rf.fit(X_feat,Y)
    # return rf_model.predict(X_feat)
