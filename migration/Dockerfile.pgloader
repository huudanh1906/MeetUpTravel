FROM dimitri/pgloader

USER root

# Install certificates
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

# Set environment variable to disable SSL certificate verification
ENV PGSSLMODE=require

ENTRYPOINT ["pgloader"] 