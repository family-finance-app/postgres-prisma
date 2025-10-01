
FROM postgres:15

ENV POSTGRES_DB=family_finance
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

EXPOSE 5432

VOLUME ["/var/lib/postgresql/data"]
