FROM catthehacker/ubuntu:act-latest

ARG BUN_VERSION=1.4.4

RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/opt/bun bash -s "bun-v${BUN_VERSION}" \
    && ln -sf /opt/bun/bin/bun /usr/local/bin/bun \
    && ln -sf /opt/bun/bin/bunx /usr/local/bin/bunx
