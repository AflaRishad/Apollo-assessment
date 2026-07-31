FROM tangramor/nginx-php8-fpm:php8.4.1_node23.3.0
COPY . .

ENV APP_KEY=base64:fkp+KQ2PvpJgwyqzpE0ZJpT2/FZC5fWdHr+dSeIgDxc=
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV WEBROOT=/var/www/html/public
ENV DB_CONNECTION=sqlite

RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www/html
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/framework/testing storage/logs bootstrap/cache database && chmod -R a+rw storage bootstrap/cache database
RUN touch database/database.sqlite && chmod a+rw database/database.sqlite
RUN php artisan migrate --force
