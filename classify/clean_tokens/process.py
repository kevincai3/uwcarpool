import re
import nltk
#nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from hunspell import Hunspell
from clean_tokens.abbr import replace_tokens
from clean_tokens.weighting import weighting

hspell = Hunspell('en_US', hunspell_data_dir='./clean_tokens/dictionary')

stopset = set(stopwords.words('english'))
stopset.discard('at')
stopset.discard('to')
stopset.discard('am')
stopset.discard('pm')

lemma = WordNetLemmatizer()

def process(message, modify=True, process_extra=True):
    m = message.lower()
    m = clean_message(m, ' ')
    m = replace_symbols(m)
    t = m.split(' ')
    if modify:
        # print(t)
        t = autocorrect(t)
        # print(t)
        t = replace_tokens(t)
        # print(t)
        t = drop_words(t)
        # print(t)
        t = lemmatize(t)
        # print(t)
    if process_extra:
        t = process_extra(t)
    return t

def replace_symbols(message):
    m = message
    m = re.sub(r"@+", r' at ', m)
    m = re.sub(r"/+", r' or ', m) # TODO:Need to ignore dates like 5/11
    m = re.sub(r"[-=]*>+", r' to ', m)
    m = re.sub(r"[^a-zA-Z0-9$:-]", r' ', m) # Delete invalid characters
    # If the colon is not surrounded by numbers, its not a time
    m = re.sub(r"([^0-9]+):", r'\1 ', m)
    m = re.sub(r":([^0-9]+)", r' \1', m)
    m = re.sub(r"--+", r' ', m)
    # Only save - if its of the forms
        # [0-9]-[0-9]
        # m-[0-9]
    m = re.sub(r"([^0-9m])-+", r'\1 ', m)
    m = re.sub(r"-+([^0-9])", r' \1', m)
    # NOTE: Delete the second part if it's hyphenated
        # m-[0-9].* -> m
        # ([0-9])-[0-9:]+(am|pm) -> \1\2
    m = re.sub(r"m-[0-9]\S*", r'm', m)
    m = re.sub(r"([0-9])-[0-9:]+(am|pm)", r'\1\2', m)
    # Drop stuff like 6ish
    m = re.sub(r"(\d)ish", r"\1", m)

    m = re.sub(r" +", r' ', m) # Delete extraneous white spaces
    return m.strip()

def drop_words(tokens):
    t = [token for token in tokens if not (token in stopset)]
    return t

def best_suggestion(suggestions):
    best = suggestions[0]
    score = 1
    for word in suggestions:
        if word in weighting and weighting[word] > score:
            best = word
            score = weighting[word]
    return best

def check_word(token):
    if re.match('[0-9]+(a|p)m', token):
        return token
    if hspell.spell(token):
        return token
    else:
        suggestions = hspell.suggest(token)
        return best_suggestion(suggestions) if len(suggestions) > 0 else token

def autocorrect(tokens):
    return [check_word(token) for token in tokens]

def lemmatize(tokens):
    return [lemma.lemmatize(token) for token in tokens]

def clean_message(message, replacement):
    m = message
    m = re.sub(r'\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*', replacement, m)
    return m

# Removes highway numbers
# Removes hyphens for times
# Removes references to 7/11
# Removes spaces between number and am/pm
def process_extra(tokens):
    t = tokens
    t = [token for token in t if not re.match(r'(400|401|403|404|407)', token)]
    t = [re.sub(r'(\d+)-[\d:]+', r'\1', token) for token in t]
    m = ' '.join(t)
    m = re.sub(r' (7 11|7-11)', r"", m)
    m = re.sub(r"([0-9]) (am|pm)", r"\1\2", m)
    return m.split(' ')

if __name__ == "__main__":
    print(process("Offering: Jun.3 Sunday 8pm Waterloo (Burger King) -> Mississauga Square One $10/Pearson Airport $40, text 5197211776"))
    print(hspell.spell('rhill'))
