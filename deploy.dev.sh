# Build
docker build -t moroccanoutlaws/api:latest .

# Push
docker push moroccanoutlaws/api:latest

# Connect to server
# Pull
# Tag
# Deploy
ssh root@moroccanoutlaws.com "docker pull moroccanoutlaws/api:latest; dokku git:from-image api moroccanoutlaws/api:latest"
