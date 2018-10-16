# tokens: [string]
# postdate: timestamp
# tolerance: int
#   represents how far apart tokens can be to be regarded as the same (0 means they must be next to each other)
# tag_func: token -> postdate -> (state, timestamp)
#   Tags a token as one of the states. States can be any:
#       0x00 -> Not valid
#       0x01 -> One part of the guess
#       0x10 -> The other part of the geuss
#       0x11 -> A complete guess
#       0x110 -> A token that can represent either part
#   Can also return a timestamp if the tag_func is able to guess on its own.
# valid_func: state -> bool
#   Checks if the state is complete (aka we have enough information to make a guess)
# parse_func: buffer, tokens, postdate, results -> None
#   Makes a guess using the buffer, and if successful, appends it to results
# greedy: bool
#   If true, attempt to make a guess even if state is not valid
# NOTE: Even if we made a guess with a token, we will continue to make guesses with that token until we hit the tolerance limit.

def detect(tokens, postdate, tolerance, tag_func, valid_func, parse_func, greedy=False):
    state = 0
    results = [] # Array of guesses (date/time tuple depending on the parse_func)
    buffer = [] # Array of indices
    for i in range(len(tokens)):
        token = tokens[i]
        token_state, guess = tag_func(token, postdate)
        if token_state == 0:
            if ((len(buffer) != 0) and (i - buffer[-1]) > tolerance) or (i + 1 == len(tokens)):
                if valid_func(state) or greedy:
                    parse_func(buffer, tokens, postdate, results)
                buffer = []
                state = 0
            else:
                continue
        else:
            if guess != None:
                results.append(([i], guess))
            else:
                buffer.append(i)
                if ((state == 0b110 and (token_state == 0b10 or token_state == 0b110)) or
                    (state == 0b10 and token_state == 0b110)):
                    state = 0b111
                state |= token_state

            if (guess == None and (valid_func(state) or greedy)) or (i + 1 == len(tokens)):
                if (valid_func(state) or greedy) and i + 1 == len(tokens):
                    parse_func(buffer, tokens, postdate, results)

    return results
