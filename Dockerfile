from node:current-slim
WORKDIR .
COPY package.json .
RUN npm install
COPY ./build ./build
ENV DATA_URI mongodb+srv://zodiac3011:zodiac3011@cluster0-5m9ay.gcp.mongodb.net/Sender?retryWrites=true&w=majority
ENV AUTH0_DOMAIN lamnguyen-dev.auth0.com
ENV AUTH0_CLIENT_ID vaZmrOxkuRNo0hrZhDkOernNGDjQqGeN
ENV AUTH0_CALLBACK http://localhost:8080/callback
ENV AUTH0_AUDIENCE http://localhost:3000
ENV SALT 9sWT89XLcmP49w4K
ENV PASSPHRASE vaZmrOxkuRNo0hrZhDkOernNGDjQqGeN
ENV PUBLIC_KEY -----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqElb2B7fz9/677K9gGPT8zTlfUxsTzGnwzUQp5Q+LfBmTqVXGdn5yvhan6OEnnR6JrJ4Ipx9Kr2bSAowyesFZjdv6NBnArxaQVsBEGZ6MxoXgQB8IxT7dwGXZii3SzlEkac+ZTIm1QIc//TRVE4z1Vww/sMx/HryuVzDOA3xz9skl/N2rUF6HHv4Xekuq8pZ5rcsjJUv4imjm3UbvRjXzGAvM8Y5V26ddej2OzlvuVQ3KVEoSCRNZ6SUKSv5uK7VI5bBsJ/Hi0ZbSb6CgtcUpRBR6KelR8j5SXqBXuDVfUcuIzUIiNSM/rlEnToQHWaRetF9u0uz7TU4j5FsHy/xhwIDAQAB-----END PUBLIC KEY-----
ENV PRIVATE_KEY -----BEGIN RSA PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCoSVvYHt/P3/rvsr2AY9PzNOV9TGxPMafDNRCnlD4t8GZOpVcZ2fnK+Fqfo4SedHomsnginH0qvZtICjDJ6wVmN2/o0GcCvFpBWwEQZnozGheBAHwjFPt3AZdmKLdLOUSRpz5lMibVAhz/9NFUTjPVXDD+wzH8evK5XMM4DfHP2ySX83atQXoce/hd6S6rylnmtyyMlS/iKaObdRu9GNfMYC8zxjlXbp116PY7OW+5VDcpUShIJE1npJQpK/m4rtUjlsGwn8eLRltJvoKC1xSlEFHop6VHyPlJeoFe4NV9Ry4jNQiI1Iz+uUSdOhAdZpF60X27S7PtNTiPkWwfL/GHAgMBAAECggEAMIDcSOE1LsvmnnmM5tle+GURk9iYCwdLzBaaU0KF3WXBhv9eqGPL/DUyoXpWufjmUAr2Vzt1VAFMJSpSv4/OgZSO27JdTkuNU/LvzpNKuznU9mh2XwIoLDe4NEid879wxO5ILJCU4qX2R8t/HeZgSCmHMZZ+7L9fAA/9cEWMoZSWW2GZM4/79VdIaZqVGWc7WTr1S2u959NfZVAsKtpdheP/sip7yWqc1HWbU5qppHHKID4k3AfbpYdDusMt28iwpJ5vJ5JFW9UN0FFPvLKPbQh/JirADDKWuOx5ARUSLhFa1oyWxfwInAbZAWqepq7LcRMTzgR2xHo7q0w4N5vqEQKBgQDqz01iUBA5mepevR0HdlV14IZd1e1PdLaM0E7KmUoFSbzhuh0QhSwTjeE6Gzg/mIxkakZl5Fb9eVCNgEo9ugg+CgmULwauVwc4d2Ai4R7KGzufHGRn8hOP2Och0ql6U8a+Pj8wNKMYTCGWvGtiLnJm8bUE0Yoe/Y6+wi+l85zHvwKBgQC3eTPVpxtwOaolzpDIN42FBqI84Susf7OVh9alj3AAWy2u1jX5babQH22rOMQPrlkPv0u+cY/eMKuyK7jrE+9SmXZbmXV4C61ksnohC2M0Yo5DAUF2FNKNNl0N6UvYL3UtChbh7hojCnMSjwxKMZ0//dXBT6uIwL5r9SXEw1aIOQKBgEnr6VjCC9mWcwpQTwtCXbU2chaoeoVBIRdDnQp7J6pyhFwr02qYAkBFslowp4yd4dTbAD6jnB9ASfPCJ503K9EcJ9fW1iucilFkg4d3h9HosORuc82lkDMA/gLP5zrzlOXfgtUSPSYxEYH633ORW8K85VgW/3yyJnY3e/iqsPjRAoGAZ3If5qu0jb8FjxF7kle4JDPMT5UJgdXylDGltW09UgYWqMhAYGURs7C0reBwswKzVmyeMT9oRXedpvR965Uuz5yVHipVEB1NY0Q6Fd2MzqFu4pqXpRMyb8oiB1DtoXOIlp9krXgJJo6iuOkMndyBc+4Tkk3wQkeiVc4/wEP+ywkCgYANjo+x0vUJI1nFCumOf5lD0J7qIEXpozGD6t+RLy4t9Zv7wli2isUb66AY+gXQvgUFgfp2zcKVo5YkveGdac1r9lc/6o8tE/CCxQNXH7t3ZdNY1TUOOllpk6mxBbPv3XwEfluB4/AC3CaRW/j7r5eJAYsspCgdltY96/8ex0+ZWA==-----END RSA PRIVATE KEY-----
EXPOSE 3000

CMD ["npm", "start"]
