# Advanced Web Mapping

For the Django app, the relevant application folder is 
> /app/world

and the Javascript logic for the application is stored in 
> /app/static/mapScript.js

For the React App, the relevant folder is called
> /React

You will need to add a file called 'secret_key.txt' in the root directory of this project to run this locally.

You will also need to load the dataset into postgis using load_amenities.py. To do this and get the app running on your machine:

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
