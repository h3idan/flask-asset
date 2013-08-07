#!/usr/bin/python
#coding:utf8
from flask import Blueprint,request,session,\
	url_for,render_template,redirect,flash
from models import OperatingpostAllot,db,Jobname
from flask_sqlalchemy import Pagination
from config import POSTS_PER_PAGE
from app import get_obj_for_page

operatingpostallot = Blueprint('operatingpostallot',__name__)

@operatingpostallot.route('/modifyoperating/<o_id>',methods=['GET','POST'])
def modifyoperating(o_id):
	'''修改岗位配备信息'''	
	operating = OperatingpostAllot.query.get(o_id)#岗位配备信息
	jobname = Jobname.query.all()#工作岗位名称
	o = OperatingpostAllot.query.get(o_id)
	if request.method == 'POST':
		o.age_limit = request.form.get(u'age_limit')
		o.jobname_id = request.form.get(u'jobname_id')
		db.session.commit()
		return redirect('/viewoperating/1')
	return render_template('operatingpostallot/modifyoperating.html',
							jobname=jobname,
							operating=operating)

@operatingpostallot.route('/viewoperating/<int:page>')
def viewoperating(page):
	'''查看岗位配备信息'''
	operating = OperatingpostAllot.query.order_by(OperatingpostAllot.id).all()#岗位配备信息
	page = int(page)
	total = int(len(operating))
	operating = get_obj_for_page(page,POSTS_PER_PAGE,operating)
	pagination = Pagination('search',page,POSTS_PER_PAGE,total,operating)
	return render_template('operatingpostallot/operating.html',
							operating=operating,
							pagination=pagination)

@operatingpostallot.route('/addoperating',methods=['GET','POST'])	
def addoperating():
	'''增加岗位配备信息'''
	jobname = Jobname.query.all() #工作岗位名称
	if request.method == 'POST':
		allotment = request.form.get(u'allotment')
		age_limit = request.form.get(u'age_limit')
		jobname_id = request.form.get(u'jobname_id')
		o = OperatingpostAllot(allotment=allotment,
								age_limit=age_limit,
								jobname_id=jobname_id)
		db.session.add(o)
		db.session.commit()
		return redirect('/viewoperating/1')
	return render_template('operatingpostallot/addoperating.html',jobname=jobname)






