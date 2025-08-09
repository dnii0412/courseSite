# Сургалтын төв - Mongolian Training Center

Монгол хэл дээрх онлайн сургалтын платформ. Next.js, TypeScript, MongoDB, Cloudinary болон QPay ашиглан хөгжүүлсэн.

## Онцлог

- 🇲🇳 **Монгол хэлний дэмжлэг** - Бүх интерфейс монгол хэл дээр
- 🎥 **Видео хичээл** - BunnY.net-аас стрим хийгдэх өндөр чанартай видео
- 💳 **QPay төлбөр** - Монголын QPay системтэй холбогдсон
- 📊 **Явцын хяналт** - Хичээлийн явцыг хянах боломж
- 🧪 **Тест системы** - Модуль бүрийн дараа тест өгөх
- 👨‍💼 **Админ самбар** - Хичээл, хэрэглэгч удирдах систем

## Технологи

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT, HTTP-only cookies
- **Payment**: BYL API,QPay API
- **Media**: Bunny.net
- **UI Components**: Radix UI, shadcn/ui

## Суулгах заавар

### 1. Repository clone хийх

\`\`\`bash
git clone <repository-url>
cd mongolian-training-center
\`\`\`

### 2. Dependencies суулгах

\`\`\`bash
npm install
\`\`\`

### 3. Environment variables тохируулах

\`.env.local\` файл үүсгээд дараах утгуудыг оруулна уу:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/training-center

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# QPay Configuration
QPAY_API_URL=https://merchant.qpay.mn
QPAY_ACCESS_TOKEN=your-qpay-access-token
QPAY_MERCHANT_CODE=your-merchant-code

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. MongoDB тохируулах

MongoDB-г локал дээр суулгаж ажиллуулна уу эсвэл MongoDB Atlas ашиглана уу.

### 5. Cloudinary тохируулах

1. [Cloudinary](https://cloudinary.com) дээр бүртгүүлнэ үү
2. Dashboard-аас API credentials-уудыг авна уу
3. \`.env.local\` файлд оруулна уу

### 6. QPay тохируулах

1. [QPay Merchant](https://merchant.qpay.mn) дээр бүртгүүлнэ үү
2. API credentials авна уу
3. Sandbox орчинд тест хийнэ үү

### 7. Ажиллуулах

\`\`\`bash
npm run dev
\`\`\`

Аппликейшн \`http://localhost:3000\` дээр ажиллана.

## QPay тохиргоо

### Sandbox орчин

Хөгжүүлэлтийн үед QPay-ийн sandbox орчныг ашиглана уу:

\`\`\`env
QPAY_API_URL=https://merchant-sandbox.qpay.mn
\`\`\`

### Тест төлбөр

1. Тест хичээлд бүртгүүлэх
2. QR код гарч ирэх
3. QPay тест апп ашиглан төлбөр хийх
4. Callback автоматаар ажиллах

## Файлын бүтэц

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course pages
│   ├── dashboard/         # User dashboard
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── auth/              # Auth components
│   ├── courses/           # Course components
│   ├── layout/            # Layout components
│   ├── payments/          # Payment components
│   └── ui/                # UI components
├── lib/                   # Utilities
│   ├── api/               # API functions
│   ├── models/            # Database models
│   └── mongodb.ts         # Database connection
└── hooks/                 # Custom hooks
\`\`\`

## Хэрэглэгчийн эрх

- **student**: Хичээл үзэх, тест өгөх
- **instructor**: Хичээл үүсгэх, засах
- **admin**: Бүх системийг удирдах

## Хөгжүүлэлт

### Шинэ хичээл нэмэх

1. Admin самбар руу нэвтрэх
2. "Хичээл удирдах" хэсэг рүү орох
3. "Шинэ хичээл" товч дарах
4. Мэдээлэл оруулах
5. Видео файл Cloudinary руу upload хийх

### Төлбөрийн систем

QPay webhook callback:
- \`/api/payments/qpay/callback\`
- Төлбөр амжилттай болсон тохиолдолд enrollment үүсгэх
- Алдаа гарсан тохиолдолд order status шинэчлэх

## Deployment

### Vercel дээр deploy хийх

1. GitHub repository үүсгэх
2. Vercel дээр import хийх
3. Environment variables тохируулах
4. Deploy хийх

### MongoDB Atlas

Production орчинд MongoDB Atlas ашиглахыг зөвлөж байна.

## Тусламж

Асуудал гарвал issue үүсгэнэ үү эсвэл холбоо барина уу.

## License

MIT License
\`\`\`
