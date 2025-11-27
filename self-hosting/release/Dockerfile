# Usage (from parent directory):
#   docker build -f ./release/Dockerfile -t stevenjdh/ferengi-rules .
#   docker run --name ferengi-rules --rm -p 8080:80 stevenjdh/ferengi-rules
#   URL: http://localhost:8080

# ================================
#   Stage 1 – Build Jekyll site
# ================================
FROM ruby:3.4 AS builder

WORKDIR /site

COPY ./common/Gemfile ./common/Gemfile.lock* ./

RUN gem install bundler && bundle install

COPY ./site/ .

# GitHub Metadata requires using PAGES_REPO_NWO environment variables or 'repository' in _config.yml to
# collect information about the repository like the description for the theme.
ENV PAGES_REPO_NWO=StevenJDH/Ferengi-Rules-of-Acquisition

# Build site into /site/_site
RUN JEKYLL_ENV=production \
    sed -i '/^webmaster_verifications:/,/^[^[:space:]]/ {/^webmaster_verifications:/d;/^[[:space:]]/d}' \
        _config.yml && \
    bundle exec jekyll clean && \
    bundle exec jekyll build

# ================================
#   Stage 2 – Serve with Nginx
# ================================
FROM nginx:stable-alpine-slim

# Remove default Nginx site config.
RUN rm /etc/nginx/conf.d/default.conf

COPY ./release/nginx.conf /etc/nginx/conf.d/site.conf

COPY --from=builder /site/_site /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
