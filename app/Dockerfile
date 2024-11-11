FROM continuumio/miniconda3
 
WORKDIR /app
 
RUN apt-get update && apt-get install -y libpoppler-dev

# Create the environment:
COPY env.yml /app
RUN conda env create -f env.yml
 
# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "awm_env", "/bin/bash", "-c"]
#RUN echo "conda activate awm_env" >> ~/.bashrc

# Copy everything in your Django project to the image.
COPY . /app
ENV PYTHONPATH="/app"

# Update PATH environment variable so that conda environment is active by default
ENV PATH /opt/conda/envs/awm_env/bin:$PATH

# for entry point
RUN chmod +x docker-entrypoint.sh
 
# Expose the port uWSGI will run on
EXPOSE 8000

ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Run uWSGI
CMD ["uwsgi", "--ini", "/app/uwsgi.ini"]