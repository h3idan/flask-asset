#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   h3idan
# datetime: 2013-07-24 10:50
#**********************************

from datetime import datetime
from flask import Blueprint, request, session, \
        url_for, render_template, redirect, flash
from models import Mywork, User, db

myWorkView = Blueprint('myWork', __name__)


emergency_dict = {
        0: u'重要紧急', 
        1: u'紧急不紧急',
        2: u'重要不紧急',
        3: u'不重要不紧急'
        }
complate_dict = {
        0: u'未完成',
        1: u'已完成'
        }


def login_require(func):
    def check():
        user_id = session.get('user_id', '')
        if user_id:
            pass
        else:
            return redirect('/login/')
    return check


@myWorkView.route('/')
@login_require
def myWork():
    user_id = session.get('user_id', None)
    if user_id:
        user = User.query.get(user_id)
        work_list = Mywork.query.filter_by(user_id=user_id).all()
    
    return render_template('myWork/mywork.html', data=locals())


@myWorkView.route('/add', methods=['GET', 'POST'])
def addWork():

    if request.method == 'POST':
        
        details = request.form.get('details', '')
        emergency = request.form.get('emergency', '')
        complate = request.form.get('complate', '')
        
        emergency = emergency_dict.get(int(emergency), 0)
        complate = complate_dict.get(int(complate), 0)
        time = datetime.now().strftime('%Y-%m-%d %H:%M')
        user_id = session.get('user_id', '')
        if user_id:
            db.session.add(Mywork(details, emergency, complate, time, user_id))
            db.session.commit()
        
        return redirect(url_for('myWork.myWork'))

    return render_template('myWork/addwork.html', data=locals())


@myWorkView.route('/modify/<work_id>', methods=['GET', 'POST'])
def modifyWork(work_id):

    work = Mywork.query.get(work_id)
    if request.method == 'POST':
        
        details = request.form.get('details', '')
        emergency = requst.form.get('emergency', '')
        complate = requst.form.get('complate', '')
        emergency = emergency_dict.get(int(emergency), 0)
        complate = complate_dict.get(int(complate), 0)
        
        work.details = details
        work.emergency = emergency
        work.complate = complate

        return redirect(url_for('myWork.myWork'))

    return render_template('myWork/modifywork.html', data=locals())


