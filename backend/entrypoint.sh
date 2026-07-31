#!/bin/sh
touch database/database.sqlite
php artisan migrate --force
exec /start.sh
