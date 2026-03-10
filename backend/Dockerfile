# Build stage
FROM gradle:8.5.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon -x test --max-workers=1 -Dorg.gradle.jvmargs="-Xmx1g"

# Runtime stage
FROM amazoncorretto:21-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
COPY --from=builder /app/upload /app/initial-upload

RUN mkdir -p /app/upload

COPY <<'EOF' /app/entrypoint.sh
#!/bin/sh
# 볼륨이 비어있으면 초기 이미지 복사
if [ -z "$(ls -A /app/upload 2>/dev/null)" ] && [ -d /app/initial-upload ]; then
    cp -r /app/initial-upload/* /app/upload/ 2>/dev/null || true
    echo "Initial upload images copied."
fi
exec java -Dserver.port=8080 -jar app.jar
EOF
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
