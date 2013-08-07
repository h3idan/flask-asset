def get_obj_for_page(page,per_page,objs):
    return objs[per_page*(page-1):page*per_page]