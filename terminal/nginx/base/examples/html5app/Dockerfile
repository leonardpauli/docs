FROM leonardpauli/docs-nginx-base:latest as internal-base

# target: dev
FROM internal-base as dev
VOLUME /app/nginx
VOLUME /app/public

# target: prod
FROM internal-base as prod
# in separate stage: RUN build_command src > public, then COPY --from=that stage
COPY ./nginx /app/nginx
COPY ./public /app/public
