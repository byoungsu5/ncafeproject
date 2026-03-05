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
EXPOSE 8081

RUN mkdir -p /app/upload
VOLUME /app/upload
# 내부 실행 포트를 8081로 지정하는 옵션 추가
ENTRYPOINT ["java", "-Dserver.port=8081", "-jar", "app.jar"]
