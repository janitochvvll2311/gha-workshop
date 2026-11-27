FROM ubuntu:24.04

ARG BUN_VERSION=1.4.4

ENV DEBIAN_FRONTEND=noninteractive \
    HOME=/home/runner \
    BUN_INSTALL=/home/runner/.bun \
    PATH=/home/runner/.bun/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git unzip \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/bash runner

USER runner
WORKDIR /home/runner

RUN curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}"

CMD ["bash"]
