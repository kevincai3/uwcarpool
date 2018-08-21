from pygtrie import StringTrie

base = {
    'sauga': 'mississauga',
    'loo': 'waterloo',
    'dt': 'toronto',
    'sq': 'mississauga',
    'bk': 'waterloo',
    'plaza': 'waterloo',
    'yyz': 'pearson',
    'uw': 'waterloo',
    'tn': 'tonight',
    'tmr': 'tomorrow',
    'stc': 'scarborough',
    'union': 'toronto',
    'downtown': 'toronto',
    'finch': 'northyork',
    'airport': 'pearson',
    'yonge': 'northyork',
    'yorkdale': 'toronto',
    'sheppard': 'northyork',
    'university': 'waterloo',
    'pmall': 'scarborough',
    'gta': 'toronto',
    'markville': 'markham',
    'fmp': 'markham',
    'mcmaster': 'hamilton',
    'downsview': 'northyork',
    'islington': 'etobicoke',
    'trt': 'toronto',
    'wlu': 'waterloo',
    'laurier': 'waterloo',
    'burger king': 'waterloo',
    'rhill': 'richmondhill',
}

t = StringTrie(separator=' ')
for k, v in base.items():
    t[k] = v.split(' ')

mapping = {k: v.split(' ') for k, v in base.items()}

def replace_tokens(tokens):
    results = []
    partial_path = ''
    for token in tokens:
        if partial_path != '':
            current = partial_path + ' ' + token
            if t.has_subtrie(current):
                partial_path = current
            elif t.has_key(current):
                results += t[current]
                partial_path = ''
                continue
            else:
                results += partial_path.split(' ')
                partial_path = ''

        if partial_path == '':
            if t.has_subtrie(token):
                partial_path = token
            elif t.has_key(token):
                results += t[token]
            else:
                results.append(token)

    if partial_path != '':
        results += partial_path.split(' ')

    return results
