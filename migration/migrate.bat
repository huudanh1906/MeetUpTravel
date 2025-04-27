@echo off
echo Building custom pgloader image...
docker build -t custom-pgloader -f Dockerfile.pgloader .
 
echo Running pgloader with custom Docker image...
docker run --rm custom-pgloader "mysql://root:@host.docker.internal:3306/meetuptravel" "postgresql://meetuptravel_ylyf_user:VY4C3ysBT6aVggZGrewOobVUoNcmEmC3@dpg-d06vu5c9c44c739irumg-a.singapore-postgres.render.com:5432/meetuptravel_ylyf?sslmode=require"
echo Migration completed! 