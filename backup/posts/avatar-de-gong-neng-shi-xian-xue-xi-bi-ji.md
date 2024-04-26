---
title: ' Avatar的功能实现学习笔记'
date: 2020-07-13 23:30:42
tags: [python,flask]
published: true
hideInList: false
feature: 
isTop: false
---


 写在开头:
  ![](http://ww1.sinaimg.cn/thumbnail/94229e83ly1ggps3dze1wj20iw0btq3c.jpg)
    以前写的笔记>-<不是很完善.....比如默认avator已经实现了，但是笔记没有后续补充。仅供参考。
   
 
 成功的把情侣空间弄成微博后的新的探索喵
   本节实现头像上传，主页头像实现
笔记大纲包含如下内容：
    - 表单设置
	-  路由设置
	-  视图
	-   数据库

<!-- more -->







## 一.表单设置

```python
class UploadAvatar(FlaskForm):
    avatar = FileField('avatar',validators=[FileRequired('文件未选择'),FileAllowed(['jpg', 'png'], 'Images only!')])
    submit = SubmitField('Submit')
```

`Flask-WTF` 提供了 `FileField` 类来处理文件上传，它在表单提交后， 自动从 `flask.request.files` 抽取数据。 `FileField` 的 data 属性是一个` Werkzeug FileStorage` 实例。
例如：
```python
from werkzeug import secure_filenamefrom flask_wtf.file import FileField


class PhotoForm(Form):
    photo = FileField('Your photo')


@app.route('/upload/', methods=('GET', 'POST'))def upload():
    form = PhotoForm()
    if form.validate_on_submit():
        filename = secure_filename(form.photo.data.filename)
    else:
        filename = None
    return render_template('upload.html', form=form, filename=filename)
```
那么 `secure_filename() `函数具体做了那些事呢？现在的问题是，有一个信条叫做“永远别相信你用户的输入” ，这句话对于上传文件的文件名也是同样有效的。
<b>Remember to set the enctype of the HTML form to multipart/form-data, otherwise request.files will be empty.</b>
因为这句话，所以templates要有所更改，查看对应的章节
## 二. Models修改

我在这里对用户增加了avatar的方法，返回是头像对应的地址
```python
def user_avatar(self):
    return './static/avatar/{}'.format(self.avatar)
```
同时我对数据库结构进行了更改，我增加了这一分类

`avatar = db.Column(db.String(120))`

注意方法和column不能重名，否则迁移数据库会识别不到更改。
修改完数据库后,用migrate进行迁移
```python
flask db migrate  -m "avatar"
flask db upgrade
```

后期优化：
考虑增加default(已完成)

## 三.路由函数

获取到表单上传的文件，用`flask`的`request`：

       ` f = form.photo.data`
       

对文件名进行检测：
```python

from werkzeug.utils import secure_filename
filename = secure_filename(f.filename)


@login_required
@app.route('/<username>/avatar', methods=['GET','POST'])
def avatar_set(username):
    username = current_user.username
    form = UploadAvatar()
    if form.validate_on_submit():
        file = form.avatar.data
        print(file)
        filename = secure_filename(file.filename)
        if file and allowed_file(file):
            upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            set_avatar(current_user.id, filename)
            return redirect(url_for('index'))


    return render_template('upload_avatar.html', title='上传你的头像把',form=form)
```
`set_avatar`是设置头像的函数，我放在了operation.py中=-=，如下：
后期可以考虑优化，例如上传图片对图片名称进行过滤并保存其md5至数据库和本体

```python
def set_avatar(cur_user,upload_path):
    user = User.query.get(cur_user)
    user.avatar = upload_path
    db.session.commit()
    return user
```
四 模板
前端还没美化，只是功能实现，凑乎看把
(一）上传头像的模板处
红体字是必须的，否则会提示文件不存在
```html
<form action="" method="post" novalidate enctype="multipart/form-data">


{{ form.hidden_tag() }}
<p>
    {{ form.avatar.label }}

    {{ form.avatar(size=32) }}
    {% for error in form.avatar.errors %}
    <span style="color: red;">[{{ error }}]</span>
    {% endfor %}
</p>
<p>{{ form.submit() }}</p>
```
(二）主页模板

````html
{% if current_user.is_anonymous or not current_user.is_authenticated %}
    <h1>Hi</h1>
    <p>快点去注册啦！oao</p>
{% else %}
<h1>Hi, {{ user.username }}!</h1>


{% for post in posts %}
<div>
    <img src="{{ current_user.user_avatar() }}" alt="user's avatar" height="100" width="100" />
    <p>{{ post.author.username }} says:</p>
    <p><b>{{ post.body }}</b> —— {{ post.timestamp }}</p></div>
{% endfor %}
{% endif %}
````
