import requests
import bs4
import mysql.connector
import random
import math

random.seed()

con=mysql.connector.connect(host="localhost",password="",user="root",db="csv")
cur= con.cursor()

cur.execute('SELECT * FROM fakenamegenerator')

conmain=mysql.connector.connect(host="localhost",password="",user="root",db="scrapdata")
cur2=conmain.cursor()

for x in cur.fetchall():
	names= (x[0])
	text=""
	for i in range(0,len(names)):
		text=text+names[i]
		if(names[i+1]==' '):
			break
	p=random.random()
	pas=(p*1000000)
	pas=round(pas)
	paswrd='{:06d}'.format(pas) #PUTS 0S IN THE BEGINNING IF THE STRING LENGTH IS LESS THAN 6
	cur2.execute(("INSERT INTO login(Name,Password,count) VALUES(%s,%s,'%s')"),(text,paswrd,1))

cur2.execute('SELECT * FROM login')
for y in cur2.fetchall():
	print(y);
cur2.commit()
