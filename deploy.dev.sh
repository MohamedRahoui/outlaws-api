# Build
docker build -t moroccanoutlaws/api:latest .

# Push
docker push moroccanoutlaws/api:latest

# Connect to server
# Pull
# Tag
# Deploy
ssh root@front.moroccanoutlaws.com "docker pull moroccanoutlaws/api:latest; docker tag moroccanoutlaws/api:latest dokku/api:latest;  dokku tags:deploy api latest"
