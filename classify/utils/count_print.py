class CountPrint:
    def __init__(self, end):
        self.end = end
        self.count = 0

    def print(self, msg):
        self.count += 1
        if self.count % self.end == 0:
            print(msg, end="", flush=True)

    def reset(self):
        self.count = 0
