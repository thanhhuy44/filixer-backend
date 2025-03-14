FROM node:23-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Cập nhật npm và cài đặt Yarn
RUN npm install -g npm@latest

RUN npm install -g @nestjs/cli

RUN corepack enable && corepack prepare yarn@stable --activate

# Sao chép file package.json và yarn.lock trước (giúp caching dependencies)
COPY package.json yarn.lock ./

# Cài đặt dependencies với Yarn
RUN yarn install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch ứng dụng nếu dùng TypeScript
RUN yarn build

# Mở cổng mặc định của NestJS (nếu cần đổi, cập nhật trong `main.ts`)
EXPOSE 3030

# Lệnh khởi động ứng dụng
CMD ["yarn", "start:prod"]
