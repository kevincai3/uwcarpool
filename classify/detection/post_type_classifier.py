import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier

from db import engine

def fetch_data():
    query = "SELECT post.id, derived.stage_3, manual.post_type FROM posts as post JOIN derived_posts AS derived ON derived.post_id = post.id JOIN manual_posts AS manual ON manual.post_id = post.id WHERE derived.stage_3 IS NOT NULL AND manual.post_type IS NOT NULL"
    posts = pd.read_sql_query(query, engine)
    return posts

def train_model():
    data = fetch_data()
    vectorizer = CountVectorizer(analyzer = analyzer)
    X_count = vectorizer.fit_transform(data["stage_3"])
    X_count_feat = pd.DataFrame(X_count.toarray())
    Y = data["post_type"]

    rf = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1)
    rf_model = rf.fit(X_count_feat,Y)
    return rf_model, vectorizer

def analyzer(text):
    return text.split(",")
    # stage3(process(text))

def predict(model, vectorizer, processed_message):
    return model.predict(vectorizer.transform([processed_message]))[0]


# count_vect = CountVectorizer(analyzer = analyzer)

# #the training set of posts for number of routes
# #in particular, the classified posts for number of routes
# posts_tr_dos = posts[~posts["driving_or_searching"].isnull()].reset_index(drop = True)

# X_count = count_vect.fit_transform(posts_tr_dos["message"])
# X_count_feat = pd.DataFrame(X_count.toarray())
# Y = posts_tr_dos["driving_or_searching"]


# def dos_classifier(message):
    # rf = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1)
    # rf_model = rf.fit(X_count_feat,Y)
    # X = count_vect.fit(posts_tr_dos["message"])
    # message_turn_vector = X.transform([message])
    # return rf_model.predict(message_turn_vector)
