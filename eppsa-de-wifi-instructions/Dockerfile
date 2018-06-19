FROM nginx:1.12.2

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
RUN mkdir /serve

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d
COPY config /etc/nginx/config
COPY dist /serve/dist
