FROM maven:3.8.5-openjdk-17 as build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
# The properties file is already inside the JAR
EXPOSE 8080
CMD ["java", "-Dspring.profiles.active=prod", "-Dspring.jpa.hibernate.ddl-auto=create", "-jar", "app.jar"] 