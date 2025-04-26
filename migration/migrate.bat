@echo off
echo Building custom pgloader image...
docker build -t custom-pgloader -f Dockerfile.pgloader .

echo Running pgloader with custom Docker image...
docker run --rm custom-pgloader --no-ssl-cert-verification "mysql://root:@host.docker.internal:3306/meetuptravel" "postgresql://meetuptravel_user:VbL1go9RbsAY7HVb5S05cHLMnpxP3unM@dpg-d06dh72li9vc73e8ov60-a.singapore-postgres.render.com:5432/meetuptravel?sslmode=require"
echo Migration completed! 