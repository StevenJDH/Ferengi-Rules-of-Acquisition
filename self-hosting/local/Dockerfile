# Usage (from parent directory):
#   docker build -f ./local/Dockerfile -t ferengi-rules-jekyll .
#   Linux / Mac:
#     docker run --name ferengi-rules-dev --rm -p 4000:4000 -p 35729:35729 \
#       -v "$(pwd)/site:/srv/jekyll" \
#       -v "$(pwd)/common/Gemfile:/srv/jekyll/Gemfile" \
#       ferengi-rules-jekyll
#   Windows (git-bash):
#     docker run --name ferengi-rules-dev --rm -p 4000:4000 -p 35729:35729 \
#       -v "$(cygpath -w $(pwd))/site:/srv/jekyll" \
#       -v "$(cygpath -w $(pwd))/common/Gemfile:/srv/jekyll/Gemfile" \
#       ferengi-rules-jekyll
#   NOTE: The volume mounts above allow you to edit the site files on your host machine and
#         have Jekyll automatically rebuild the site inside the container. If this is not
#         needed, then they can be omitted from the command.
#   URL: http://localhost:4000

FROM ruby:3.4

WORKDIR /srv/jekyll

# Copy the Gemfile and install dependencies to use cache for speeding up builds later.
COPY ./common/Gemfile ./common/Gemfile.lock* ./

# Install gems.
RUN gem install bundler && bundle install

# Copy the rest of the project into the container.
COPY ./site/ .

# GitHub Metadata requires using PAGES_REPO_NWO environment variables or 'repository' in _config.yml to
# collect information about the repository like the description for the theme.
ENV PAGES_REPO_NWO=StevenJDH/Ferengi-Rules-of-Acquisition

EXPOSE 4000
EXPOSE 35729

ENTRYPOINT ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
CMD ["--livereload", "--force_polling"]
