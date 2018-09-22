from pytz import utc
from flask import Flask, request, jsonify

from classify_search import classify_message
from update_tables.update_tables import update_tables

app = Flask(__name__)

@app.route('/api/parse', methods=['POST'])
def parseParam():
    data = request.get_json()
    if data == None or 'query' not in data:
        return jsonify({ 'error' : 'query not found in request' }), 400

    posttype, routes, dates, times = classify_message(data['query'])
    rtn = { 'posttype': posttype }
    if len(routes[0]) != 0:
        rtn['fromLoc'] = routes[0][0]
    if len(routes[1]) != 0:
        rtn['toLoc'] = routes[1][0]
    if dates[0] != None:
        rtn['date'] = dates[0].astimezone(utc).isoformat()
    if times[0] != None:
        rtn['time'] = times[0].astimezone(utc).isoformat()

    return jsonify(rtn)

@app.route('/api/updatetables', methods=['POST'])
def updateTrips():
    try:
        new_posts, new_trips = update_tables()
        return jsonify({
            'newPosts': len(new_posts),
            'newTrips': len(new_trips),
        })
    except e as Exception:
        print(e)
        return 500
