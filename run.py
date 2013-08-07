#!/usr/bin/env python
# coding: utf-8


import os
from flask import Flask
from app.myWork_view import myWorkView
from app.userManage_view import userManageView
from app.equipment_view import equipment
from app.login_view import user
from app.comsumable_view import comsumable
from app.project_view import project
from app.account_view import account

app = Flask(__name__)
app.debug = True

# config file
app.config.from_object('config')


# blueprint register
app.register_blueprint(myWorkView, url_prefix='/mywork')
app.register_blueprint(userManageView, url_prefix='/usermanage')
app.register_blueprint(equipment)
app.register_blueprint(user)
app.register_blueprint(comsumable)
app.register_blueprint(project)
app.register_blueprint(account)


if __name__ == '__main__':

    app.run(host='0.0.0.0')


