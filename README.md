# BÉ VUI HỌC V2.4.1 — Sửa nguồn âm thanh (Web/Mobile PWA)

## Vì sao V2.4 vẫn nghe khó hiểu?

Bản V2.4 chứa 22 MP3 tổng hợp thử nghiệm chưa được duyệt chất lượng tiếng Việt. File có thể phát được nhưng tiếng đọc không rõ, đặc biệt không đủ tin cậy để dạy trẻ cách phát âm. Việc đổi trình duyệt hoặc dùng HTTPS không thể sửa được nội dung âm thanh bị lỗi. **V2.4.1 đã loại bỏ bộ giọng cũ khỏi bài học.**

## V2.4.1 có gì mới?

- Mục **Ba mẹ → Phòng thu giọng cô giáo**, hiển thị đủ 22 câu cần đọc. Có thể **Ghi âm** trực tiếp trên Chrome qua HTTPS, hoặc **Chọn tệp** từ thiết bị, **Thử nghe**, và **Tải lại** file đã ghi.
- File ghi được lưu bằng IndexedDB trên từng thiết bị. Chưa đồng bộ lên đám mây; không gửi giọng của bé đi đâu.
- Phân biệt kiểm tra **🔔 chuông** (loa, trình phát, mạng) với **👩‍🏫 lời cô** (chất lượng và tính đầy đủ bản ghi).
- Chế độ phụ tùy chọn sử dụng giọng tiếng Việt của trình duyệt, chỉ dùng khi ba mẹ nghe thử và thấy rõ.
- Service Worker đổi phiên bản cache, **không còn tự dùng 22 tệp MP3 cũ**. Các bản MP3 đã được duyệt có thể được cập nhật riêng.

**Giới hạn thẳng thắn:** bản ZIP này **chưa chứa giọng nữ Việt chuẩn**. Chỉ có một tiếng chuông để kiểm tra đường truyền/phát âm thanh. Khi chưa thêm giọng đủ chất lượng, app sẽ thông báo rõ thay vì nói khó hiểu. Đây chưa phải giải pháp hoàn thiện cô giáo AI.

## Cập nhật repository GitHub hiện có

Repository hiện có thư mục `public/`, `README.md`, `check-assets.mjs`. Giải nén ZIP và tải **các file/thư mục bên trong**, không tải nguyên ZIP. Khi GitHub hỏi, chọn commit lên `main`.

Các file bắt buộc cần được thay trên GitHub:

```
public/index.html
public/app.js
public/styles.css
public/sw.js
public/audio/test-tone.mp3
public/audio-approved/manifest.json
public/audio-approved/VOICE_SCRIPTS.md
README.md
check-assets.mjs
```

Có thể giữ nguyên `public/scene.svg`, `public/teacher.svg`, `public/icons/` và các file PWA khác. Các MP3 cũ trong `public/audio/` có thể xóa sau, vì V2.4.1 không tham chiếu đến chúng. Thư mục `.github` **không bắt buộc** nếu bạn triển khai qua Cloudflare Pages kết nối GitHub.

Trong Cloudflare Pages, giữ Framework `None`, build output `public`. Sau khi Cloudflare báo deploy thành công, trên điện thoại **đóng app/tab cũ rồi tải lại hai lần** để cập nhật Service Worker. Kiểm tra góc Ba mẹ thấy **V2.4.1** ở cuối trang trước khi thử.

## 3 cách có giọng cô rõ

**A. Ghi âm trực tiếp (dễ thử nhất):** mở web đã triển khai HTTPS bằng Chrome trên Android, vào **Ba mẹ → Phòng thu giọng cô giáo**, chọn từng câu, bấm Ghi âm → Dừng ghi → Thử nghe. App lưu bản ghi ngay trên thiết bị đó. Nếu thu trực tiếp bằng Android Chrome, có thể tạo WebM (không phải MP3), nhưng app vẫn phát được trên máy đó.

**B. Nhập giọng thu/tổng hợp đã được duyệt:** chọn file MP3, M4A, WAV hoặc WebM phù hợp từng câu. Chất lượng phát âm phải được người lớn kiểm tra. Các bản ghi trong IndexedDB không tự chuyển sang thiết bị khác.

**C. Đồng bộ bộ MP3 đã được duyệt qua GitHub (cho mọi thiết bị):** đặt đúng 22 tệp MP3 tại `public/audio-approved/<id>.mp3` và thay `public/audio-approved/manifest.json` từ `{}` thành object đánh dấu từng file đã duyệt, ví dụ:

```json
{"welcome": true, "vi0": true, "vi1": true}
```

Chỉ bật `true` khi file thực sự tồn tại **và đã được nghe kiểm tra rõ tiếng Việt**. Xem `public/audio-approved/VOICE_SCRIPTS.md` để biết từng câu. Khi bạn upload file âm thanh lên repository **công khai**, ai truy cập website cũng có thể tải file đó. Không dùng giọng người thật khi chưa được người đó đồng ý công khai.

**Dùng dịch vụ AI TTS chuyên nghiệp** là hướng mở rộng hợp lý, nhưng cần một nhà cung cấp/API hỗ trợ tiếng Việt và có thể phát sinh phí. Để tránh lộ khóa API, không bao giờ đưa khóa vào `public/` hay repository công khai. Mã V2.4.1 chưa tự kết nối dịch vụ TTS này.

## Kiểm tra nhanh

1. Mở website HTTPS bằng Chrome trên điện thoại. Bấm `🔔 Kiểm tra loa`. Nếu có tiếng chuông là loa và trình phát đang hoạt động.
2. Bấm `👩‍🏫 Thử nghe giọng cô`. Khi chưa có file được duyệt, ứng dụng báo thiếu bản ghi; đây là hành vi chủ ý để không tiếp tục dạy trẻ bằng giọng lỗi.
3. Vào `Ba mẹ` → Ghi âm câu `welcome`, bấm `Thử nghe`. Nếu nghe rõ giọng vừa ghi, luồng phát và lưu file đã hoạt động trên thiết bị đó.
4. Nếu dùng giọng trình duyệt, chọn nguồn giọng ở `Ba mẹ`, thử lời chào và chỉ tiếp tục nếu nghe rõ.

## Các thành phần giữ nguyên

Hai hồ sơ tiến độ riêng, hai bài mẫu Tiếng Việt/Toán, thưởng sao, tập tô, giao diện sáng và PWA. Chưa có hội thoại AI hai chiều. Tiến độ hai bé lưu localStorage trên từng thiết bị. Giọng ghi âm riêng lưu IndexedDB.
