#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   h3idan
# datetime: 2013-08-05 15:47
#**********************************

'''
    增加权限列表的数据
'''



import os.path
import sys
sys.path.append('../')
from app.models import app, db, Permissions


num = 0
for table in db.get_tables_for_bind():
    
    db.session.add(Permissions(u'增加%s权限' % table.name, 'add_%s' % table.name))
    db.session.add(Permissions(u'查看%s权限' % table.name, 'view_%s' % table.name))
    db.session.add(Permissions(u'修改%s权限' % table.name, 'change_%s' % table.name))
    db.session.commit()
    print 'Inserted: Can add %s, add_%s' % (table.name, table.name)
    print 'Inserted: Can view %s, view_%s' % (table.name, table.name)
    print 'Inserted: Can change %s, change_%s' % (table.name, table.name)
    num += 3

print 'Inserted data has complated. total %d datas' % num
 
