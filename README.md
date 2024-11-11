# AWM CA1

**Video demo:** https://youtu.be/lXY2hGGHGug

**Website:** https://dfegan.xyz/login/ (click sign up and make account before logging in)



The relevant app folder is 'world' and the html file in 'world/templates/map.html' is the focus feature of the website.

You will need to add a file called 'secret_key.txt' in the root directory of this project to run this locally.

You will also need to load the world/data/export.json using load_amenities.py. To do this and get the app running on your machine:

1. Start all containers by running:
   > docker-compose up --build
   
2. Then in another terminal connect to the app container:
   > docker exec -it app bash

3. In the app container activate the environment
   > conda activate awm_env

4. Open the python shell:
   > python manage.py shell

5. And finally in the python shell run:
   > from world import load_amenities
   
   > load_amenities.run()
