# Báo cáo hướng dẫn khởi tạo và chạy dự án

## 1. Chuẩn bị môi trường

- Cài đặt Node.js phiên bản 18 trở lên (dự án khai báo node ^24.12.0).
- Đảm bảo có quyền cài đặt gói toàn cục (global) bằng npm.

## 2. Khởi tạo dự án mới

```bash
npm init
```

- Làm theo lời nhắc để tạo `package.json` (hãy giữ script `start` như đã cấu hình để chạy `nodemon --exec ts-node src/index.ts`).

## 3. Cài đặt TypeScript và ts-node toàn cục

```bash
npm install -g typescript ts-node
```

- Cung cấp lệnh biên dịch TypeScript (`tsc`) và chạy trực tiếp file `.ts` (`ts-node`) trên mọi dự án.

## 4. Cài đặt phụ thuộc cục bộ cho dự án

```bash
npm install typescript ts-node express node @types/express @types/node nodemon @types/nodemon
```

- `typescript`, `ts-node`: hỗ trợ biên dịch/khởi chạy TypeScript trong dự án.
- `express`: framework web.
- `node`: khai báo phiên bản Node.js mong muốn trong phụ thuộc.
- `nodemon`: tự động khởi động lại khi mã nguồn thay đổi.
- Bộ `@types/...`: cung cấp định nghĩa kiểu cho TypeScript.

## 4.1. Cài đặt Mongoose để kết nối MongoDB

```bash
npm install mongoose @types/mongoose
```

- `mongoose`: Thư viện ODM để kết nối và thao tác với MongoDB.
- `@types/mongoose`: Type definitions cho TypeScript.

## 5. Cấu hình dự án TypeScript

- Kiểm tra `tsconfig.json` đã bao gồm thư mục nguồn `src` và thiết lập phù hợp (`target`, `module`, v.v.).
- Đảm bảo file `src/index.ts` là điểm vào chính của ứng dụng.

## 5.1. Kết nối MongoDB trong src/index.ts

```typescript
import * as mongoose from "mongoose";

// Kết nối MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://username:password@cluster.mongodb.net/?appName=myapp"
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });
```

**⚠️ Lưu ý bảo mật:**

- Không hard-code password trực tiếp trong code
- Sử dụng environment variables (`.env` file)
- Thêm `.env` vào `.gitignore`

## 6. Chạy server ở môi trường phát triển

```bash
npm run start
```

- Script `start` gọi `nodemon --exec ts-node src/index.ts`, vì vậy mỗi lần thay đổi file `.ts` sẽ tự động reload.

## 7. Kiểm tra hoạt động

- Nếu dùng Express, truy cập `http://localhost:<port>` (ví dụ 3000) để xác minh server chạy đúng.
- Kiểm tra terminal để chắc chắn không có lỗi TypeScript.

## 8. Ghi chú thêm

- Nếu gặp lỗi quyền khi cài gói global, hãy chạy terminal dưới quyền Administrator.
- Để triển khai sản xuất, nên biên dịch TypeScript sang JavaScript (`npx tsc`) và chạy bằng Node.js thuần (`node dist/index.js`).
