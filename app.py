#!/bin/sh

import os
import sys

from flask import Flask, render_template, request, redirect
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.utils import secure_filename

# embedding c program into python
from subprocess import call


UPLOAD_PATH = 'static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp'}

app = Flask(__name__)


app.config['UPLOAD_PATH'] = UPLOAD_PATH


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            # flash('No file part')
            print("No file part")
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            # flash('No selected file')
            print("empty file name")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
            
            # embedding c into application
            call(['./filter', '-b', f'static/uploads/{filename}','static/uploads/blur.bmp'])
            call(['./filter', '-g', f'static/uploads/{filename}','static/uploads/gray.bmp'])
            call(['./filter', '-e', f'static/uploads/{filename}','static/uploads/edges.bmp'])
            call(['./filter', '-r', f'static/uploads/{filename}','static/uploads/reflect.bmp'])

            # getting user uploaded image and saving to static/upload

            return render_template('filter.html')
    return render_template('index.html')




# Catches Errors on Page :) 

def apology(message, code=400):
    """Render message as an apology to user."""
    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s
    return render_template("apology.html", top=code, bottom=escape(message)), code

def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)