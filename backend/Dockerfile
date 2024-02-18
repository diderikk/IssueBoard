FROM ruby:2.7

# RUN apt-get update \
#     && apt-get install -y --no-install-recommends \
#         postgresql-client \
#     && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN gem install bundler && \
    bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install
COPY . .

ENV PORT=8080
ENV RAILS_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true
ENV RAILS_LOG_TO_STDOUT=true
ARG MASTER_KEY
ENV RAILS_MASTER_KEY=${MASTER_KEY}

RUN echo $RAILS_MASTER_KEY >> config/master.key

EXPOSE $PORT
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "8080", "-e", "production"]