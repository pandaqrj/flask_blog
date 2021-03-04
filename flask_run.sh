cd /home/pi/app/pyvenv/blog_venv
source venv/bin/activate
nohup flask run --port 8000 > /home/pi/app/pyvenv/blog_venv/nohup.out &
