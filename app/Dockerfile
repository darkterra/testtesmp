FROM nginx:1.13.9 as builder
LABEL Jeremy Young

########################## General ##########################
# Install the NGINX Amplify Agent
RUN apt-get update \
    && apt-get install -qqy curl python apt-transport-https apt-utils gnupg1 procps \
    && echo 'deb https://packages.amplify.nginx.com/debian/ stretch amplify-agent' > /etc/apt/sources.list.d/nginx-amplify.list \
    && curl -fs https://nginx.org/keys/nginx_signing.key | apt-key add - > /dev/null 2>&1 \
    && apt-get update \
    && apt-get install -qqy nginx-amplify-agent \
    && apt-get purge -qqy curl apt-transport-https apt-utils gnupg1 \
    && rm -rf /var/lib/apt/lists/*

# Add Gulp File process /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\

########################## SetUp FRONT ##########################
# FROM nginx:1.13.9-alpine

# COPY --from=builder /var/lib/nginx-amplify-agent /var/lib/

# Keep the nginx logs inside the container
RUN unlink /var/log/nginx/access.log \
    && unlink /var/log/nginx/error.log \
    && touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && chown nginx /var/log/nginx/*log \
    && chmod 644 /var/log/nginx/*log

# Copy nginx conf
COPY ./config/nginx.conf /etc/nginx/
COPY ./config/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /www/front

# Add React App and Libs
ADD ./dist /www/front


COPY ./entrypoint.sh /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
