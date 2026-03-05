# Build stage
FROM gradle:8.5.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon -x test --max-workers=1 -Dorg.gradle.jvmargs="-Xmx1g"

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080

RUN mkdir -p /app/upload
VOLUME /app/upload
ENTRYPOINT ["java", "-Dserver.port=8036", "-jar", "app.jar"]
