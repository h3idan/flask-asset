#!/usr/bin/env python
# coding: utf-8

#**********************************
# author:   xc
# datetime: 2013-07-24 
#**********************************


from flask import Blueprint, request, session, \
        url_for, render_template, redirect, flash
from models import Project, db, Formalities, Acceptance
import pdb
from flask_sqlalchemy import  Pagination
from config import POSTS_PER_PAGE
from app import get_obj_for_page

account = Blueprint('account', __name__)

@account.route('/account')
def viewaccount():
	return render_template('account/viewaccount.html',data=locals())