cd ./backend
. venv/bin/activate
python manage.py migrate
python manage.py initadmin
python manage.py runserver