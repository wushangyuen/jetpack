#!/bin/bash

# Exit if any command fails.
set -e

# Gutenberg script includes.
. "$(dirname "$0")/includes.sh"

# Set up environment variables
. "$(dirname "$0")/bootstrap-env.sh"

# These are the containers and values for the development site.
CLI="cli_e2e_tests"
CONTAINER='wordpress_e2e_tests'
SITE_TITLE='E2E Testing'

# Download image updates.
echo -e $(status_message "Downloading Docker image updates...")
docker-compose $DOCKER_COMPOSE_FILE_OPTIONS pull mysql wordpress_e2e_tests cli_e2e_tests

# Launch the containers.
echo -e $(status_message "Starting Docker containers...")
docker-compose $DOCKER_COMPOSE_FILE_OPTIONS up -d --remove-orphans --force-recreate mysql wordpress_e2e_tests cli_e2e_tests >/dev/null


# Get the host port for the WordPress container.
HOST_PORT=$(docker-compose $DOCKER_COMPOSE_FILE_OPTIONS port $CONTAINER 80 | awk -F : '{printf $2}')

# Wait until the Docker containers are running and the WordPress site is
# responding to requests.
echo -en $(status_message "Attempting to connect to WordPress...")
until $(curl -L http://localhost:$HOST_PORT -so - 2>&1 | grep -q "WordPress"); do
    echo -n '.'
    sleep 5
done
echo ''

docker-compose $DOCKER_COMPOSE_FILE_OPTIONS run --rm -u 33 $CLI wp-content/jetpack-dev/tests/e2e/bin/cli-prep.sh http://localhost:$HOST_PORT

# Install a dummy favicon to avoid 404 errors.
echo -e $(status_message "Installing a dummy favicon...")
docker-compose $DOCKER_COMPOSE_FILE_OPTIONS run --rm $CONTAINER touch /var/www/html/favicon.ico

echo -e $(status_message "Activating Jetpack and test plugins..")

docker-compose $DOCKER_COMPOSE_FILE_OPTIONS run --rm $CONTAINER "wp-content/jetpack-dev/tests/e2e/bin/prep.sh"

docker-compose $DOCKER_COMPOSE_FILE_OPTIONS run --rm -u 33 $CLI plugin activate jetpack-dev --quiet


docker-compose $DOCKER_COMPOSE_FILE_OPTIONS run --rm -u 33 $CLI plugin activate e2e-plan-data-interceptor.php --quiet

echo
status_message "Open ${WP_SITE_URL} to see your site!"
echo
