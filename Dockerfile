# Build Template Manager server Docker container
FROM alpine:latest
MAINTAINER Bob Nadler <robert.nadler@gmail.com>
RUN apk --update add apache2 && rm -rf /var/cache/apk/*
ENTRYPOINT ["httpd"] 
CMD ["-D", "FOREGROUND"]
COPY dist /var/www/localhost/htdocs
