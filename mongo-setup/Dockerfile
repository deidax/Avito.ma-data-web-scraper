FROM mongo

WORKDIR /usr/src
RUN mkdir configs
WORKDIR /usr/src/configs

COPY mongo-setup.js .
COPY mongo-setup.sh .


RUN chmod +x ./mongo-setup.sh

CMD ["./mongo-setup.sh"]