FROM mcr.microsoft.com/vscode/devcontainers/base:0-buster

ENV DENO_VERSION=v1.6.3
ENV DENO_INSTALL=/deno
ENV PUPPETEER_PRODUCT=chrome
ENV PUPPETEER_CHROMIUM_REVISION=818858

RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh -o install-deno.sh \
    && sh install-deno.sh ${DENO_VERSION} \
    && chown -R vscode /deno \
    && rm install-deno.sh

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
   && apt-get -y install --no-install-recommends make

# Install Chromium through Puppeteer
RUN deno run -A --unstable https://deno.land/x/puppeteer@5.5.1/install.ts
ENV PUPPETEER_EXECUTABLE_PATH=/deno/.cache/deno/deno_puppeteer/chromium/linux-${PUPPETEER_CHROMIUM_REVISION}/chrome-linux/chrome
