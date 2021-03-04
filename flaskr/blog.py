from flask import (
    Blueprint, flash, g, redirect, request, url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('blog', __name__, url_prefix='/apis')


@bp.route('/get_posts')
def get_posts():
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()

    author_id = -1
    if g.user is not None:
        author_id = g.user['id']
    topic_list1 = posts[0:round(len(posts)/2-0.1)]
    topic_list2 = posts[round(len(posts)/2-0.1):len(posts)]

    rs_data = {
        'topic_list1': topic_list1
       ,'topic_list2': topic_list2
       ,'author_id': author_id
    }
    return rs_data


@bp.route('/create', methods=('POST',))
@login_required
def create():
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            return error
        else:
            db = get_db()
            db.execute(
                """
                 INSERT INTO post (title, body, author_id, created)
                 VALUES (?, ?, ?, DATETIME(CURRENT_TIMESTAMP,'localtime'))
                """,
                (title, body, g.user['id'])
            )
            db.commit()
            return redirect(url_for('index'))



def get_post(id, check_author=True):
    post = get_db().execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()

    if post is None:
        abort(404, "Post id {0} doesn't exist.".format(id))

    if check_author and post['author_id'] != g.user['id']:
        abort(403)

    return post


@bp.route('/<int:id>/update', methods=('POST',))
@login_required
def update(id):
    get_post(id)

    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            return(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE post SET title = ?, body = ?'
                ' WHERE id = ?',
                (title, body, id)
            )
            db.commit()
            return redirect(url_for('index'))



@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute('DELETE FROM post WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('index'))