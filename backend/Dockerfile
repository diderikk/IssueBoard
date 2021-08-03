FROM ruby:2.7

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile* ./
RUN gem install bundler:2.2.19
RUN bundle install
COPY . .

EXPOSE 4000
CMD ["rails", "server", "-p", "4000", "-b", "0.0.0.0"]