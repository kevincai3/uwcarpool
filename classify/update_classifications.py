from update_tables.obtain_new_posts import obtain_new_posts, obtain_posts
from update_tables.update_estimate_posts import update_estimate_posts

if __name__ == "__main__":
    posts = obtain_new_posts()
    print(len(posts))
    update_estimate_posts(posts)
