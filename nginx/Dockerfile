FROM nginx:latest

RUN apt-get update && apt-get install -y git && apt-get install -y fcgiwrap

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/http-https-redirect.conf /etc/nginx/conf.d/http-https-redirect.conf
COPY conf.d/https-reverse-proxy.conf /etc/nginx/conf.d/https-reverse-proxy.conf

RUN mkdir /etc/letsencrypt
COPY letsencrypt /etc/letsencrypt

CMD /etc/init.d/fcgiwrap start && nginx -g daemon\ off\;
