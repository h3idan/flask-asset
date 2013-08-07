#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   h3idan
# datetime: 2013-07-24 14:13
#**********************************


import os
from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://123:123456@192.168.8.103/flaskasset'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:heidan@127.0.0.1/flaskasset'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:xuchao@127.0.0.1/flaskasset'

app.config['SQLALCHEMY_MIGRATE_REPO'] = os.path.join(os.path.dirname(__file__), 'db_repository')
db = SQLAlchemy(app)


class User(db.Model):
    '''
        用户表
    '''
    
    role_category = {
            'admin': 0, 
            'keyborder': 1, 
            'department header': 2, 
            'top header': 3, 
            'employee': 4 
            }


    id = db.Column(db.Integer, primary_key=True)
    login_name = db.Column(db.String(30), unique=True)
    username = db.Column(db.String(30))
    password = db.Column(db.String(100))
    tel = db.Column(db.String(20), nullable=True)
    role = db.Column(db.Integer, default=4)

    department_id = db.Column(db.Integer, db.ForeignKey('department.id'))
    jobname_id = db.Column(db.Integer, db.ForeignKey('jobname.id'))

    mywork = db.relationship('Mywork', backref='user', lazy='dynamic')
    allot_user = db.relationship('EquipmentAllot', backref='user', lazy='dynamic')
    
    def __init__(self, login_name, username, password, tel, role, \
            department_id, jobname_id):
        self.login_name = login_name
        self.username = username
        self.password = password
        self.tel = tel
        self.role = role
        self.department_id = department_id 
        self.jobname_id =  jobname_id

    def _repr__(self):
        return '<User %r>' % self.username


class Jobname(db.Model):
    '''
        工作岗位名称表
    '''

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True)

    operatingpost_allot = db.relationship('OperatingpostAllot', \
            backref='jobname', lazy='dynamic')
    user = db.relationship('User', backref='jobname', lazy='dynamic')

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Jobname %r>' % self.name


class Department(db.Model):
    '''
       部门表 
    '''

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)

    user = db.relationship('User', backref='department', lazy='dynamic')

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Department %r>' % self.name

        
class Permissions(db.Model):
    '''
        权限表
    '''

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    codename = db.Column(db.String(50), unique=True)

    def __init__(self, name, codename):
        self.name = name
        self.codename = codename

    def __repr__(self):
        return '<Permissions %r>' % self.name


class UserPermissions(db.Model):
    '''
        用户权限
    '''

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    permission_id = db.Column(db.Integer)

    def __init__(self, user_id, permission_id):
        self.user_id = user_id
        self.permission_id = permission_id

    def __repr__(self):
        return '<UserPersmissions %r>' % self.user_id


class Assets(db.Model):
    '''
        固定资产表
    '''

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    asset_code = db.Column(db.Integer, unique=True)
    category = db.Column(db.String(20))
    price = db.Column(db.Integer)
    photo = db.Column(db.String(200), unique=True, nullable=True)
    max_age = db.Column(db.Integer)
    equipment_code = db.Column(db.Integer, db.ForeignKey('equipment.code')) 
    project_code = db.Column(db.Integer, db.ForeignKey('project.code')) 
    
    
    def __init__(self, name, asset_code, category, price, photo, max_age): 
        self.name = name
        self.asset_code
        self.category = category
        self.price = price
        self.photo = photo
        self.max_age = max_age

    def __repr__(self):
        return '<Assets %r>' % self.name


class Equipment(db.Model):
    '''
        设备信息表
    '''

    STATUS = {
            0: u'已报废',
            1: u'使用中'
            }
    FD = {
        0: u'无软驱',
        1: u'有软驱',
    }
    TYPE = {
        0: u'计算机设备',
        1: u'移动载体设备',
        2: u'其他设备',
    }
    CARD = {
        0: u'无读卡器',
        1: u'有读卡器',
    }
    #基础数据
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))  #设备名称
    code = db.Column(db.Integer, unique=True)  #设备代码  
    type_code = db.Column(db.Integer)     #类别代码
    type_name = db.Column(db.String(100)) #类别名称
    brand = db.Column(db.String(100))  #品牌
    type_model = db.Column(db.String(100))   #规格型号
    equ_num = db.Column(db.String(100))   #机身号
    by_use = db.Column(db.String(100))    #用途
    status = db.Column(db.String(10), default=STATUS.get(1))  #使用现状
    use_unit = db.Column(db.String(30))   #使用单位
    unit_num = db.Column(db.String(30))   #单位代码
    depository = db.Column(db.String(20)) #保管人
    location = db.Column(db.String(20))   #存放地点
    buy_time = db.Column(db.DateTime, default=datetime.now())  #购置日期
    put_time = db.Column(db.DateTime, default=datetime.now())  #更新日期
    out_time = db.Column(db.DateTime, default=datetime.now())  #打印日期
    details = db.Column(db.String(100))  #备注
    
    allotment_id = db.relationship('EquipmentAllot', backref='equipment', lazy='dynamic')
    asset = db.relationship('Assets', backref='equipment', lazy='dynamic') 
    #移动载体
    secret_degree = db.Column(db.String(20))     #保密级别（密级）
    #计算机数据
    system = db.Column(db.String(20), nullable=True)  #操作系统
    mac_addr = db.Column(db.String(30))  #MAC地址     
    upd_sys_time = db.Column(db.DateTime)    #系统更新时间
    disk_num = db.Column(db.Integer)   #硬盘个数
    disk_type = db.Column(db.String(20))   #硬盘型号
    disk_volume = db.Column(db.String(20)) #硬盘容量
    disk_code = db.Column(db.String(30))   #硬盘序列号
    ip_address = db.Column(db.String(30))  #IP地址
    hostname = db.Column(db.String(30))    #主机名
    license = db.Column(db.String(30))     #使用许可证号
    cpu = db.Column(db.String(30))         #CPU规格
    memory_capacity = db.Column(db.String(20)) #内存容量
    cd_type = db.Column(db.String(20))     #光驱类型
    cd_type_num = db.Column(db.String(20))    #光驱型号
    fd = db.Column(db.String(10), default=FD.get(0))  #有无软驱
    card_reader = db.Column(db.String(10), default=CARD.get(0))   #有无读卡器
    external = db.Column(db.String(30))   #外接设备

    equ_type = db.Column(db.String(20), default=TYPE.get(2))


    def __init__(self,name,code,type_code,type_name,brand,type_model,equ_num,by_use,use_unit,unit_num,depository,location,buy_time,put_time,out_time,details,status,secret_degree,system,mac_addr,upd_sys_time,disk_num,disk_type,disk_volume,disk_code,ip_address,hostname,license,cpu,memory_capacity,cd_type,cd_type_num,fd,card_reader,external,equ_type):
        self.name=name
        self.code=code
        self.type_code=type_code
        self.type_name=type_name
        self.brand=brand
        self.type_model=type_model
        self.equ_num=equ_num
        self.by_use=by_use
        self.use_unit=use_unit
        self.unit_num=unit_num
        self.depository=depository
        self.location=location
        self.buy_time=buy_time
        self.put_time=put_time
        self.out_time=out_time
        self.details=details
        self.status=status
        self.secret_degree=secret_degree
        self.system=system
        self.mac_addr=mac_addr
        self.upd_sys_time=upd_sys_time
        self.disk_num=disk_num
        self.disk_type=disk_type
        self.disk_volume=disk_volume
        self.disk_code=disk_code
        self.ip_address=ip_address
        self.hostname=hostname
        self.license=license
        self.cpu=cpu
        self.memory_capacity=memory_capacity
        self.cd_type=cd_type
        self.cd_type_num=cd_type_num
        self.fd=fd
        self.card_reader=card_reader
        self.external=external
        self.equ_type=equ_type

    def __repr__(self):
        return '<Equipment %r>' % self.name


class EquipmentAllot(db.Model):
    '''
        设备流动情况
    '''

    id = db.Column(db.Integer, primary_key=True)
    allot_time = db.Column(db.DateTime, default=datetime.now())
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.id')) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


    def __init__(self, allot_time, equipment_id, user_id):
        self.allot_time = allot_time
        self.equipment_id = int(equipment_id)
        self.user_id = int(user_id)

    def __repr__(self):
        return '<EquipmentAllot %r>' % self.recipient
    

class Project(db.Model):
    '''
        工程科研数据表
    '''
    STATUS = {
            0: u'完成',
            1: u'进行中'
            }
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    code = db.Column(db.Integer, unique=True)
    status = db.Column(db.String(10), default=STATUS.get(0)) 
    formalities = db.relationship('Formalities', backref='project', lazy='dynamic')
    acceptance = db.relationship('Acceptance', backref='project', lazy='dynamic')
    assets = db.relationship('Assets', backref='project', lazy='dynamic')

        
    def __init__(self, name, code, status):
        self.code = int(code)
        self.name = name
        self.status = status

    def __repr__(self):
        return '<Project %r>' % self.name


class Formalities(db.Model):
    '''
       项目手续办理进度情况 
    '''

    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime, default=datetime.now())
    procedure = db.Column(db.String(500))
    image = db.Column(db.String(200), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))
    
    def __init__(self, time, procedure, image, project_id):
        self.time = time
        self.procedure = procedure
        self.image = image
        self.project_id = project_id

    def __repr__(self):
        return '<Formalities %r>' % self.procedure


class Acceptance(db.Model):
    '''
        项目验收进度情况
    '''

    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime, default=datetime.now())
    procedure = db.Column(db.String(500))
    image = db.Column(db.String(200), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))
    
    def __init__(self, time, procedure, image, project_id):
        self.time = time
        self.procedure = procedure
        self.image = image
        self.project_id = project_id

    def __repr__(self):
        return '<Formalities %r>' % self.procedure


class Mywork(db.Model):
    '''
        工作日志表
    '''

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

    id = db.Column(db.Integer, primary_key=True)
    details = db.Column(db.Text, nullable=True, default='')
    emergency = db.Column(db.Integer, default=0)
    complate = db.Column(db.Integer, default=0)
    time = db.Column(db.DateTime, default=datetime.now())
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, details, emergency, complate, time, user_id):
        self.details = details
        self.emergency = emergency
        self.complate = complate
        self.time = time
        self.user_id = user_id

    def __repr__(self):
        return '<Mywork %r>' % self.details
    

class Comsumable(db.Model):
    '''
        耗材表
    '''

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Integer, unique=True)
    name = db.Column(db.String(100))
    position = db.Column(db.String(1000))
    brand_type = db.Column(db.String(200))
    price = db.Column(db.String(30))
    counts = db.Column(db.Integer)
    adaptive = db.Column(db.String(200))
    into_time = db.Column(db.DateTime)
    buy_unit = db.Column(db.String(200))
    buy_unit_tel = db.Column(db.Integer)
    getcomsumable = db.relationship('GetComsumable', backref='comsumable', lazy='dynamic')


    def __init__(self, code, name, position, brand_type, price, \
            counts, adaptive, into_time, buy_unit, buy_unit_tel):

        self.code = int(code)
        self.name = name
        self.position = position
        self.brand_type = brand_type
        self.price = price
        self.counts = int(counts)
        self.adaptive = adaptive
        self.into_time = into_time
        self.buy_unit = buy_unit
        self.buy_unit_tel = buy_unit_tel

    def __repr__(self):
        return '<Comsumable %r>' % self.name


class GetComsumable(db.Model):
    '''
        耗材领用情况表
    '''
    
    id = db.Column(db.Integer, primary_key=True)
    out_time = db.Column(db.DateTime)
    get_unit = db.Column(db.String(200))
    get_count = db.Column(db.Integer)
    receiptor = db.Column(db.String(30))
    comsumable_id = db.Column(db.Integer, db.ForeignKey('comsumable.id'))

    
    def __init__(self, out_time, get_unit, get_count, receiptor, comsumable_id):
        self.out_time = out_time
        self.get_unit = get_unit
        self.get_count = get_count
        self.receiptor = receiptor
        self.comsumable_id = comsumable_id

    def __repr__(self):
        return '<GetComsumable %r>' % self.receiptor


class OperatingpostAllot(db.Model):
    '''
        岗位配备信息
    '''

    id = db.Column(db.Integer, primary_key=True)
    allotment = db.Column(db.Text)
    age_limit = db.Column(db.Integer)
    jobname_id = db.Column(db.Integer, db.ForeignKey('jobname.id'))

    def __init__(self, allotment, age_limit, jobname_id):
        self.jobname_id = jobname_id
        self.allotment = allotment
        self.age_limit = age_limit

    def __repr__(self):
        return '<OperatingpostAllot %r>' % self.job_name
