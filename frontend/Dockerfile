# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package.json yarn.lock ./
# Set environment to skip optional dependencies that don't work in Linux
ENV npm_config_optional=false
RUN yarn install --frozen-lockfile --ignore-optional || yarn install --network-timeout 100000 --ignore-optional
COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 