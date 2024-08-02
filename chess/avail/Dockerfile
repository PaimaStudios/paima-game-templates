FROM rust:1.75 AS base

RUN apt update -y && apt install protobuf-compiler -y

FROM base AS node_builder

RUN git clone https://github.com/availproject/avail
WORKDIR "/avail"

# This builds the binary. Important to note here is the fast-runtime feature to have 8 seconds between blocks.
RUN cargo build --locked --release --features fast-runtime
RUN cp target/release/avail-node /bin/
RUN which curl

FROM debian:bookworm-slim AS node
COPY --from=node_builder /bin/avail-node /bin
ADD ./health_check.sh bin
RUN apt update -y && apt install curl net-tools vim -y
CMD ["/bin/avail-node", "--dev", "--name=LocalAvailNode", "-d=/output/data", "--rpc-methods=unsafe", "--unsafe-rpc-external", "--rpc-cors=all", "--enable-kate-rpc", "--state-pruning=archive-canonical"]

## light client

FROM rust:1.75 AS light_builder

RUN apt update -y && apt install clang -y

RUN git clone https://github.com/availproject/avail-light.git
WORKDIR "/avail-light"

RUN cargo build --locked --release --bin avail-light
RUN cp target/release/avail-light /bin/

RUN cargo build --locked --release -p avail-light-bootstrap
RUN cp target/release/avail-light-bootstrap /bin/

FROM debian:bookworm-slim AS light
COPY --from=light_builder /bin/avail-light /bin

ADD ./avail-light-config.yaml .
ADD ./identity.toml .

CMD ["/bin/avail-light", "--config", "avail-light-config.yaml"]

FROM debian:bookworm-slim AS bootstrap
COPY --from=light_builder /bin/avail-light-bootstrap /bin
CMD ["/bin/avail-light-bootstrap"]
