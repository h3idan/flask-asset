#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   h3idan
# datetime: 2013-07-29 17:10
#**********************************


from datetime import datetime
import hashlib
from flask import Blueprint, request, session, \
        url_for, render_template, redirect, flash, \
        jsonify
from models import Department, User, Jobname, db, \
        Permissions, UserPermissions

userManageView = Blueprint('userManage', __name__)


role_category = {
        0: u'系统管理员',
        1: u'录入员',
        2: u'科级领导',
        3: u'处级领导', 
        4: u'普通员工'
        }

@userManageView.route('/')
def userList():
    '''
        用户列表
    '''

    users = []
    user_list = User.query.order_by('id desc').all()
    for user in user_list:
        department_name = Department.query.filter_by(id=user.department_id).first()
        jobname = Jobname.query.filter_by(id=user.jobname_id).first()
        role_name = role_category[int(user.role)]
        setattr(user, 'department', department_name)
        setattr(user, 'jobname', jobname)
        setattr(user, 'role_name', role_name) 
        users.append(user) 

    return render_template('userManage/userList.html', data=users)


@userManageView.route('/add', methods=['get', 'post'])
def addUser():
    '''
        添加新用户
    '''

    department = Department.query.order_by('id desc').all()
    jobname = Jobname.query.order_by('id desc').all()

    if request.method == 'POST':
        login_name = request.form.get('login_name', '')
        user = User.query.filter_by(login_name=login_name).first()
        if user:
            pass
        else:
            username = request.form.get('username', '')
            password = request.form.get('password', '123456')
            password = hashlib.md5(password).hexdigest()
            tel = request.form.get('tel', '')
            role = request.form.get('role', '')
            department_id = request.form.get('department_id', '')
            jobname_id = request.form.get('jobname_id', '')

            db.session.add(User(login_name, username, password, tel, \
                    role, int(department_id), int(jobname_id)))
            db.session.commit()
            return redirect(url_for('userManage.userList'))

    return render_template('userManage/adduser.html', data=locals())


@userManageView.route('/checkunique', methods=['get', 'post'])
def checkUnique():
    '''
        检查用户名是否唯一
            PS：可以使用flask-form对表单进行验证和使用表单
    '''

    if request.method == 'POST':
        login_name = request.form.get('login_name', '')
        user = User.query.filter_by(login_name=login_name).first()
        if user:
            return jsonify(result=u'该登录名已经存在')


@userManageView.route('/department_jobname', methods=['get', 'post'])
def departmentJobname():
    '''
        新增部门名称，岗位名称及其显示
    '''

    department = Department.query.order_by('id desc').all()
    jobname = Jobname.query.order_by('id desc').all()
    
    if request.method == 'POST':
        department = request.form.get('department', '')
        jobname = request.form.get('jobname', '')
        
        if department and jobname:
            db.session.add(Department(department))
            db.session.add(Jobname(jobname))
            db.session.commit()
        elif department:
            db.session.add(Department(department))
            db.session.commit()
        elif jobname:
            db.session.add(Jobname(jobname))
            db.session.commit()

        return redirect(url_for('.departmentJobname'))

    return render_template('userManage/departmentJobname.html', data=locals())


@userManageView.route('/modify/<user_id>', methods=['get', 'post'])
def modifyUser(user_id):
    '''
        修改用户的属性
    '''

    user = User.query.get(user_id)
    roles = []
    role_name = role_category.get(user.role)
    for i in role_category.keys():
        if i != user.role:
            roles.append({
                'role_num': i,
                'role_name': role_category.get(i)
                })

    department = Department.query.get(user.department_id)
    departments = Department.query.order_by('id desc').all()
    departments.remove(department)
    jobname = Jobname.query.get(user.jobname_id)
    jobnames = Jobname.query.order_by('id desc').all()
    jobnames.remove(jobname)

    if request.method == 'POST':
        username = request.form.get('username', '')
        tel = request.form.get('tel', '')
        department_id = request.form.get('department_id', '')
        jobname_id = request.form.get('jobname_id', '')
        role = request.form.get('role', '')
        
        user.username = username
        user.tel = tel
        user.department_id = department_id
        user.jobname_id = jobname_id
        user.role = int(role)
        
        return redirect(url_for('userManage.userList'))

    return render_template('userManage/modifyuser.html', data=locals())


@userManageView.route('/resetpw', methods=['get', 'post'])
def resetPasswd():
    '''
        重置密码
    '''

    if request.method == 'POST':
        user_id = request.form.get('user_id', '')
        if user_id:
            user = User.query.get(int(user_id))
            password = hashlib.md5('123456').hexdigest()
            user.password = password
            return jsonify(result=u'修改成功')


@userManageView.route('/permissionManage/<user_id>', methods=['get', 'post'])
def permissionManage(user_id):
    '''
        权限管理
    '''

    old_permissions = []
    new_permissions = []
    user = User.query.get(int(user_id))
    permissions = Permissions.query.all() 
    user_permissions = UserPermissions.query.filter_by(user_id=user.id).all()
    
    if user:
        if request.method == 'POST':

            for user_permission in user_permissions:
                old_permissions.append(user_permission.permission_id)

            form_datas = request.form.to_dict()
            for permission_id in form_datas.values():
                new_permissions.append(int(permission_id))
            
            new_builds = set(new_permissions) - set(old_permissions)
            del_builds = set(old_permissions) - set(new_permissions)
            
            print new_builds
            print 'del_builds: %r' % del_builds
            if new_builds: 
                for new_build in new_builds:
                    db.session.add(UserPermissions(user_id, new_build))
            if del_builds:
                for del_build in del_builds:
                    print del_build
                    db.session.delete(UserPermissions(user_id, del_build))
            
            db.session.expunge_all() 
            db.session.commit() 
            return redirect(url_for('.userList'))
        
    return render_template('userManage/permissionManage.html', data = locals())   

    










