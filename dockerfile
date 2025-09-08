# Dockerfile - Production static site served by nginx
FROM nginx:stable-alpine AS prod

# Copy site contents to nginx html folder
COPY . /usr/share/nginx/html

# Expose nginx default port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
