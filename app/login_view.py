#!/usr/bin/python
#coding: utf8

from flask import Blueprint,session,request,render_template,abort,flash,abort,url_for, redirect
from models import User,db
import hashlib


user = Blueprint('user',__name__)

@user.route('/infosys',methods=['GET','POST'])
def login():	
	if request.method == 'GET':
		userName = request.args.get('userName')
		password = request.args.get('password')
#		password = hashlib.md5(request.form['password']).hexdigest()
		user = User.query.filter_by(login_name=userName).first()
		if user and user.login_name==userName and user.password==password:
			session['user_id'] = user.id
			return redirect('/outcom/1')

	return render_template('login.html')




