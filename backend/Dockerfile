FROM tangramor/nginx-php8-fpm:php8.4.1_node23.3.0
COPY . .
ENV APP_KEY=base64:fkp+KQ2PvpJgwyqzpE0ZJpT2/FZC5fWdHr+dSeIgDxc=
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV WEBROOT=/var/www/html/public
ENV SESSION_DRIVER=file
ENV CACHE_STORE=file
ENV DB_CONNECTION=pgsql
ENV DB_HOST=dpg-d9mmqsdbedkc73e3age0-a
ENV DB_PORT=5432
ENV DB_DATABASE=apollo_2ke3
ENV DB_USERNAME=apollo_2ke3_user
ENV DB_PASSWORD=IZ3rn0wPRsQ2Lt8HRVPpPhkgRIPbnj7d
RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www/html
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/framework/testing storage/logs bootstrap/cache && chmod -R a+rw storage bootstrap/cache
RUN php artisan migrate --force
