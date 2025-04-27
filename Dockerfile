FROM maven:3.8.5-openjdk-17 as build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
# Spring will read environment variables automatically because of Spring Boot's relaxed binding
# We don't need to explicitly mention them here since they're defined in render.yaml
CMD ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"] 