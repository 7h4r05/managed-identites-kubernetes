FROM nginx:1.13.9-alpine

COPY build /usr/share/nginx/html
EXPOSE 3000:80

CMD ["nginx", "-g", "daemon off;"]