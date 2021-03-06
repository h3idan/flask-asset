#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   xc
# datetime: 2013-07-24 
#**********************************


from flask import Blueprint, request, session, \
        url_for, render_template, redirect, flash, send_from_directory
from models import Project, db, Formalities, Acceptance, app
import os, pdb, random, PIL.Image as Image
from flask_sqlalchemy import  Pagination
from config import POSTS_PER_PAGE, UPLOAD_FOLDER
from app import get_obj_for_page
from werkzeug import secure_filename
from flask.ext.wtf import Form
from wtforms import *

app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

project = Blueprint('project', __name__)

class Formalform(Form):
	time = DateTimeField('time')
	procedure = TextField('procedure')
	image = FileField('image')	

@project.route('/viewpro/<int:page>')
def viewproject(page):
	project = Project.query.order_by(-Project.id).all()
	page = int(page) #获取当前页面页数
	total = int(len(project))
	project = get_obj_for_page(page, POSTS_PER_PAGE, project)
	pagination = Pagination('search',page, POSTS_PER_PAGE, total, project)
	return render_template('/project/viewproject.html', project=project,pagination=pagination)

@project.route('/addpro', methods=['GET', 'POST'])
def viewaddproject():
	if request.method == 'POST':
		name = request.form['name']
		code = request.form['code']
		status = request.form['status']
		if int(status) == 0:
			status = u'完成'
		else:
			status=u'进行中'
		p = Project(name = name,code = code,status = status.encode('utf8'))
		try:
			db.session.add(p)
			db.session.commit()
		except Exception,err:
			print err
			db.session.flush()
		return redirect('/viewpro/1')
	return render_template('project/addproject.html', data=locals())

@project.route('/viewformal/<int:p_id>/<int:page>')
def viewformal(p_id,page):
	p = Project.query.get(p_id)
	formals = Formalities.query.filter_by(project_id = p_id).order_by(-Formalities.id).all()
	page = int(page) #获取当前页面页数
	total = int(len(formals))
	formals = get_obj_for_page(page, POSTS_PER_PAGE, formals)
	pagination = Pagination('search',page, POSTS_PER_PAGE, total, formals)
	return render_template('project/viewformals.html', pagination = pagination, formals = formals, p = p)

@project.route('/viewformals/<int:page>')
def viewformals(page):
	formals = Formalities.query.order_by(-Formalities.id).all()
	page = int(page) #获取当前页面页数
	total = int(len(formals))
	formals = get_obj_for_page(page, POSTS_PER_PAGE, formals)
	pagination = Pagination('search',page, POSTS_PER_PAGE, total, formals)
	return render_template('project/viewfor.html', pagination = pagination, formals = formals)

@project.route('/addformal/<int:p_id>', methods=['GET','POST'])
def viewaddformal(p_id):
	p = Project.query.get(p_id)
	form = Formalform(request.form)
	if request.method == 'POST' and form.validate():
		time = request.form['time']
		procedure = request.form['procedure']
		file = request.files['image']
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
 			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			try:
				img = Image.open(UPLOAD_FOLDER+'/'+filename)#打开原图
			except  Exception, err:
				print "pic is not file"
				return 
			nimg = img.resize((120,150))#缩图
			nimg.save(UPLOAD_FOLDER+'/'+filename)#覆盖原图
			f = Formalities(time=time, procedure=procedure, image=filename, project_id=p_id)
			try:
				db.session.add(f)
				db.session.commit()
			except Exception,err:
				print err
				db.session.flush()
		return redirect('/viewformal/%s/1'%(p_id))
	return render_template('project/addformal.html', p=p)

@project.route('/viewformalbase/<f_id>')
def viewformalbase(f_id):
	f = Formalities.query.get(f_id)
	return render_template('project/viewformalbase.html', f=f)
@project.route('/media/<filename>')
def uploaded_file(filename):
	return send_from_directory(app.config['UPLOAD_FOLDER'],filename)
def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
