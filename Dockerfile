FROM postgres:15-alpine

# Устанавливаем переменные окружения для создания базы данных
ENV POSTGRES_DB=family_finance
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

RUN echo "listen_addresses = '*'" >> /usr/local/share/postgresql/postgresql.conf.sample
RUN echo "max_connections = 100" >> /usr/local/share/postgresql/postgresql.conf.sample
RUN echo "shared_buffers = 128MB" >> /usr/local/share/postgresql/postgresql.conf.sample
RUN echo "log_min_duration_statement = 1000" >> /usr/local/share/postgresql/postgresql.conf.sample
RUN echo "log_connections = on" >> /usr/local/share/postgresql/postgresql.conf.sample
RUN echo "log_disconnections = on" >> /usr/local/share/postgresql/postgresql.conf.sample

EXPOSE 5432

COPY init.sql /docker-entrypoint-initdb.d/
