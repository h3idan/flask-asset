#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   xc
# datetime: 2013-07-24 
#**********************************


from flask import Blueprint, request, session, \
        url_for, render_template, redirect, flash
from models import Comsumable, db, GetComsumable
import pdb
from flask_sqlalchemy import  Pagination
from config import POSTS_PER_PAGE
from app import get_obj_for_page

comsumable = Blueprint('comsumable', __name__)

@comsumable.route('/viewcom/<int:page>')
def viewcomsumable(page):

	page = int(page) #获取当前页面页数
	comsumables = Comsumable.query.order_by(-Comsumable.id).all()
	total = int(len(comsumables))
	comsumables = get_obj_for_page(page, POSTS_PER_PAGE, comsumables)
	pagination = Pagination('search',page, POSTS_PER_PAGE, total, comsumables)
	return render_template('comsumable/viewcom.html', pagination = pagination, comsumables = comsumables)

@comsumable.route('/addcom', methods=['GET', 'POST'])
def viewaddcom():
	if request.method == 'POST':
		code = request.form['code']
		name = request.form['name']
		position = request.form['position']
		brand_type = request.form['brand_type']
		price = request.form['price']
		counts = request.form['counts']
		adaptive = request.form['adaptive']
		into_time = request.form['into_time']
		buy_unit = request.form['buy_unit']
		buy_unit_tel = request.form['buy_unit_tel']
		c = Comsumable(code=code, name=name, position=position, brand_type=brand_type, price=price, counts=counts, adaptive=adaptive, into_time=into_time, buy_unit=buy_unit, buy_unit_tel=buy_unit_tel)
		try:
			db.session.add(c)
			db.session.commit()
		except Exception,err:
			print err
			db.session.flush()
		return redirect('/viewcom/1')
	return render_template('comsumable/addcom.html')

@comsumable.route('/allotcom', methods=['GET', 'POST'])
def viewallotcom():
	comsumable = Comsumable.query.all()
	if request.method == 'POST':
		print 'ssssssssss'
		out_time = request.form['out_time']
		get_unit = request.form['get_unit']
		get_count = request.form['get_count']
		receiptor = request.form['receiptor']
		comsumable_id = request.form['comsumable_id']
		g = GetComsumable(out_time=out_time, get_unit=get_unit, get_count=get_count, receiptor=receiptor, comsumable_id=comsumable_id)
		try:
			db.session.add(g)
			db.session.commit()
		except Exception,err:
			print err
			db.session.delete(g)
			db.session.commit()
		c = Comsumable.query.get(comsumable_id)
		count = c.counts 
		c.counts = count - int(get_count)
		db.session.commit()  
		return redirect('/outcom/1')
	return render_template('comsumable/allotcom.html', comsumable=comsumable)

@comsumable.route('/outcom/<int:page>')
def viewoutcomsumale(page):
	getcom = GetComsumable.query.order_by(-GetComsumable.id).all()
	
	page = int(page) #获取当前页面页数
	total = int(len(getcom))
	getcom = get_obj_for_page(page, POSTS_PER_PAGE, getcom)
	pagination = Pagination('search',page, POSTS_PER_PAGE, total, getcom)
	
	return render_template('comsumable/outcom.html', getcom=getcom,pagination=pagination)
