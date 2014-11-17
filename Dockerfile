# Build Template Manager server Docker container
FROM coreos/apache
MAINTAINER Bob Nadler <robert.nadler@gmail.com>
COPY dist /var/www/
