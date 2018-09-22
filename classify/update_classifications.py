from update_tables.obtain_new_posts import obtain_new_posts, obtain_posts
from update_tables.update_estimate_posts import update_estimate_posts
from update_tables.update_derived_posts import update_derived_posts
from update_tables.update_groups import update_groups
from update_tables.update_trips import update_trips

def temp():
    posts = obtain_posts()
    print(len(posts))
    #for i in range(0, len(posts), 20000):
        #new_posts = update_derived_posts(posts[i:i+20000])
    #print(update_groups(posts, True))
    new_posts, new_groups = update_groups(posts, True)
    update_trips(posts, new_groups)

def main():
    posts = obtain_new_posts()
    print(len(posts))
    posts = update_derived_posts(posts)
    posts = update_estimate_posts(posts)

if __name__ == "__main__":
    #main()
    temp()
