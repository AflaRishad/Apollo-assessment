FROM tangramor/nginx-php8-fpm:php8.4.1_node23.3.0
COPY . .

RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1
