import inspect
import os

DEBUG = False

if os.getenv("DEBUG") == "local":
    DEBUG = True

CBEGIN = '\33[32m'
CEND = '\33[0m'

def trimcwd(path):
    return os.path.relpath(path, os.getcwd())

def debug(*x):
    if DEBUG:
        calling_frame = inspect.stack()[1]
        print(f"{CBEGIN}{trimcwd(calling_frame.filename)}:{calling_frame.lineno}{CEND}", *x)

if __name__ == "__main__":
    debug("hi")
