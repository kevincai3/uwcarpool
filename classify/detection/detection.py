# tokens: [string]
# postdate: timestamp
# tolerance: int
# tag_func: token -> postdate -> (state, timestamp)
#  Tags a token as one of the states
# valid_func: state -> bool
#  Checks if the state is complete
# parse_func: buffer -> tokens -> postdate -> results -> None
#  Appends the parsed time/date to results if the buffer was parsable

def detect(tokens, postdate, tolerance, tag_func, valid_func, parse_func, greedy=False):
    state = 0
    results = []
    buffer = []
    for i in range(len(tokens)):
        token = tokens[i]
        token_state, date = tag_func(token, postdate)
        # print(token, token_state)
        if token_state == 0:
            if ((len(buffer) != 0) and (i - buffer[-1]) > tolerance) or (i + 1 == len(tokens)):
                if valid_func(state) or greedy:
                    parse_func(buffer, tokens, postdate, results)
                buffer = []
                state = 0
            else:
                continue
        else:
            if date != None:
                results.append(([i], date))
            else:
                buffer.append(i)
                if ((state == 0b110 and (token_state == 0b10 or token_state == 0b110)) or
                    (state == 0b10 and token_state == 0b110)):
                    state = 0b111
                state |= token_state
            # print(token, token_state, i, date, buffer, valid_func(state))

            if (date == None and (valid_func(state) or greedy)) or (i + 1 == len(tokens)):
                if (valid_func(state) or greedy) and i + 1 == len(tokens):
                    parse_func(buffer, tokens, postdate, results)

    return results
