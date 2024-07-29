# 베이스 이미지로 node의 최신 LTS 버전 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# Python, make, g++ 및 pkg-config, pixman 설치
RUN apk add --no-cache python3 make g++ pkgconfig pixman

# package.json과 package-lock.json 파일을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --force

# Next.js 빌드를 위해 프로젝트 소스를 복사
COPY . .

# Next.js 빌드
RUN npm run build

# Next.js 애플리케이션을 실행하기 위한 설정
ENV NODE_ENV production

# Next.js 애플리케이션 시작
CMD ["npm", "start"]

# Next.js가 사용하는 포트를 노출
EXPOSE 3000
