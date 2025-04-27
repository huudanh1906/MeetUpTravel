FROM maven:3.8.5-openjdk-17 as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
# Use CMD to start the application
# The "-Dspring.profiles.active=prod" activates the production profile
CMD ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"] 