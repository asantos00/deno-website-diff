FROM mcr.microsoft.com/vscode/devcontainers/base:0-buster

ENV DENO_VERSION=v1.6.0
ENV DENO_INSTALL=/deno

RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh -o install-deno.sh \
    && sh install-deno.sh ${DENO_VERSION} \
    && chown -R vscode /deno \
    && rm install-deno.sh

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      make ca-certificates --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
