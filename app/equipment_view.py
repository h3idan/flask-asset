#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   xc
# datetime: 2013-07-24 
#**********************************


from flask import Blueprint, request, session, \
        url_for, render_template, redirect, flash
from models import Equipment, db, EquipmentAllot, User
import pdb
from flask_sqlalchemy import  Pagination
from config import POSTS_PER_PAGE
from app import get_obj_for_page

equipment = Blueprint('equipment', __name__)

def check_allot(func):
	def check(request):
		if request.method == 'POST':
			equipment_id = request.form['equipment_id']
			user_id = request.form['user_id']
			allot = EquipmentAllot.query.all()
			for a in allot:
				if a.equipment_id == int(equipment_id) and a.user_id == int(user_id):
					msg = u'添加失败，要添加记录已存在！！！'
					return redirect(url_for('equipment.viewallot'), msg = msg)
	return check


@equipment.route('/ADDE', methods=['GET', 'POST'])
def addequipment():

	if request.method == "POST":
		print 'ssssssssss22'
		#pdb.set_trace()
		name = request.form.get('name')  #设备名称
		code = request.form.get('code')  #设备代码  
		type_code = request.form.get('type_code')     #类别代码
		type_name = request.form.get('type_name') #类别名称
		brand = request.form.get('brand')  #品牌
		type_model = request.form.get('type_model')   #规格型号
		equ_num = request.form.get('equ_num')   #机身号
		by_use = request.form.get('by_use')    #用途
		use_unit = request.form.get('use_unit')   #使用单位
		unit_num = request.form.get('unit_num')   #单位代码
		depository = request.form.get('depository') #保管人
		location = request.form.get('location')   #存放地点
		buy_time = request.form.get('buy_date')  #购置日期
		put_time = request.form.get('put_date')  #更新日期
		out_time = request.form.get('out_date')  #打印日期
		details = request.form.get('details')  #备注
		status = request.form.get('status')
		#移动载体
		secret_degree = request.form.get('secret_degree','')     #保密级别（密级）
		#计算机数据
		system = request.form.get('system','')  #操作系统
		mac_addr = request.form.get('MAC','')  #MAC地址     
		upd_sys_time = request.form.get('upd_sys_time','0000-00-00')    #系统更新时间
		disk_num = request.form.get('disk_num',0)   #硬盘个数
		disk_type = request.form.get('disk_type','')   #硬盘型号
		disk_volume = request.form.get('disk_volume','') #硬盘容量
		disk_code = request.form.get('disk_code','')   #硬盘序列号
		ip_address = request.form.get('ip_address','')  #IP地址
		hostname = request.form.get('hostname','')    #主机名
		license = request.form.get('license','')     #使用许可证号
		cpu = request.form.get('cpu','')         #CPU规格
		memory_capacity = request.form.get('memory_capacity','') #内存容量
		cd_type = request.form.get('cd_type','')     #光驱类型
		cd_type_num = request.form.get('cd_type_num','')    #光驱型号
		fd = request.form.get('fd',0)  #有无软驱
		card_reader = request.form.get('card_reader',0)   #有无读卡器
		external = request.form.get('external','')   #外接设备

		equ_type = request.form.get('equ_type')
		if int(status) == 0:status = u'已废弃'
		else:status=u'使用中'
		if int(fd) == 0:fd = u'无光驱'
		else:fd = u'有光驱'
		if int(card_reader) == 0: card_reader = u'无读卡器'
		else:card_reader = u'有读卡器'
		try:
			e = Equipment(name=name,code=code,type_code=type_code,type_name=type_name,brand=brand,type_model=type_model,equ_num=equ_num,by_use=by_use,use_unit=use_unit,unit_num=unit_num,depository=depository,location=location,buy_time=buy_time,put_time=put_time,out_time=out_time,details=details,status=status,secret_degree=secret_degree,system=system,mac_addr=mac_addr,upd_sys_time=upd_sys_time,disk_num=disk_num,disk_type=disk_type,disk_volume=disk_volume,disk_code=disk_code,ip_address=ip_address,hostname=hostname,license=license,cpu=cpu,memory_capacity=memory_capacity,cd_type=cd_type,cd_type_num=cd_type_num,fd=fd,card_reader=card_reader,external=external,equ_type=equ_type)
			db.session.add(e)
			db.session.commit()
		except Exception,err:
			print err
		return redirect('/VEQ/1')
	return render_template('equipment/addtypeequipment.html', data=locals())

@equipment.route('/MEV/<e_id>', methods=['GET','POST'])
def modifyequipment(e_id):
	e = Equipment.query.get(e_id)
	equ_type = e.equ_type
	if equ_type == u'计算机设备': e_num=0
	elif equ_type == u'移动载体设备': e_num=1
	else:e_num=2
	if e.status == u'已废弃':status = 0
	else:status= 1
	if e.fd == u'无光驱':fd = 0
	else:fd = 1
	if e.card_reader == u'无读卡器': card_reader = 0
	else:card_reader = 1
	setattr(e,'e_num',e_num)
	if request.method == 'POST':
		e.name=request.form.get('name')
		e.type_code=request.form.get('type_code')
		e.type_name=request.form.get('type_name')
		e.brand=request.form.get('brand')
		e.type_model=request.form.get('type_model')
		e.equ_num=request.form.get('equ_num')
		e.by_use=request.form.get('by_use')
		e.use_unit=request.form.get('use_unit')
		e.unit_num=request.form.get('unit_num')
		e.depository=request.form.get('depository')
		e.location=request.form.get('location')
		e.buy_time=request.form.get('buy_date')
		e.put_time=request.form.get('put_date')
		e.out_time=request.form.get('out_date')
		e.details=request.form.get('details')
		status=request.form.get('status',0)
		if int(status) == 0:status = u'已废弃'
		else:status=u'使用中'
		e.status = status
		e.secret_degree=request.form.get('secret_degree')
		e.system=request.form.get('system')
		e.mac_addr=request.form.get('mac_addr')
		e.upd_sys_time=request.form.get('upd_sys_time')
		e.disk_num=request.form.get('disk_num')
		e.disk_type=request.form.get('disk_type')
		e.disk_volume=request.form.get('disk_volume')
		e.disk_code=request.form.get('disk_code')
		e.ip_address=request.form.get('ip_address')
		e.hostname=request.form.get('hostname')
		e.license=request.form.get('license')
		e.cpu=request.form.get('cpu')
		e.memory_capacity=request.form.get('memory_capacity')
		e.cd_type=request.form.get('cd_type')
		e.cd_type_num=request.form.get('cd_type_num')
		fd=request.form.get('fd',0)
		if int(fd) == 0:fd = u'无光驱'
		else:fd = u'有光驱'
		e.fd = fd
		card_reader=request.form.get('card_reader', 0)
		if int(card_reader) == 0: card_reader = u'无读卡器'
		else:card_reader = u'有读卡器'
		e.card_reader = card_reader
		e.external=request.form.get('external')
		db.session.commit()
		return redirect('/VEQ/1')

	return render_template('equipment/modifyequipment.html', e=e,status=status,fd=fd,card_reader=card_reader)

@equipment.route('/VEQ/<int:page>')
def viewequipment(page):
	equipment = Equipment.query.order_by(-Equipment.id).all()
	page = int(page) #获取当前页面页数
	total = int(len(equipment))
	equipment = get_obj_for_page(page, POSTS_PER_PAGE, equipment)
	pagination = Pagination('search',page, POSTS_PER_PAGE, total, equipment)
	return render_template('equipment/viewequipments.html', equipment=equipment, pagination=pagination)

@equipment.route('/viewbase/<e_id>')
def viewbase(e_id):
	e = Equipment.query.get(e_id)
	equ_type = e.equ_type
	if equ_type == u'计算机设备': e_num=0
	elif equ_type == u'移动载体设备': e_num=1
	else:e_num=2
	setattr(e,'e_num',e_num)
	print e.e_num
	return render_template('equipment/viewbase.html', e=e)

@equipment.route('/computer')
def viewcomputer():
	return render_template('equipment/computer.html')

@equipment.route('/mobile')
def viewmobile():
	
	return render_template('equipment/mobile.html')

@equipment.route('/other')
def viewother():
	
	return render_template('equipment/other.html')

@equipment.route('/allot/<int:page>')
def viewallot(page):
	allot = EquipmentAllot.query.order_by(-EquipmentAllot.id).all()
	page = int(page) #获取当前页面页数
	total = int(len(allot))
	allot = get_obj_for_page(page, POSTS_PER_PAGE, allot)
	pagination = Pagination('search',page, POSTS_PER_PAGE, total, allot)
	return render_template('equipment/viewallot.html',allot=allot,pagination=pagination)
@check_allot
@equipment.route('/addallot', methods=['GET', 'POST'])
def viewaddallot():
	user = User.query.all()
	equipment = Equipment.query.all()
	if request.method == "POST":
		equipment_id = request.form['equipment_id']
		user_id = request.form['user_id']
		allot_time = request.form['allot_time']
		a = EquipmentAllot(allot_time = allot_time, equipment_id = equipment_id, user_id = user_id)
		db.session.add(a)
		db.session.commit()
		return redirect('/allot/1')
	return render_template('equipment/addallot.html',user=user,equipment=equipment)
@check_allot
@equipment.route('/mallot/<a_id>', methods=['GET','POST'])
def viewmallot(a_id):
	a = EquipmentAllot.query.get(a_id)
	e = Equipment.query.get(a.equipment_id)
	u = User.query.get(a.user_id)
	users = User.query.all()
	equipment = Equipment.query.all()
	if request.method == "POST":
		equipment_id = request.form['equipment_id']
		user_id = request.form['user_id']
		allot_time = request.form['allot_time']
		a.equipment_id = equipment_id
		a.user_id = user_id
		a.allot_time = allot_time
		db.session.commit()		 
		return redirect('/allot/1')
	return render_template('equipment/mallot.html',a=a,e=e,u=u,users=users,equipment=equipment)


