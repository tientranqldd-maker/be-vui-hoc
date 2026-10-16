# BÉ VUI HỌC V2.5 — Web + Mobile (PWA)

Một **ứng dụng web đa nền tảng** dành cho hai bé mầm non chuẩn bị vào lớp 1. Chạy được trên Android, iPhone/iPad và Windows từ cùng **một đường link HTTPS**. Có thể thêm vào màn hình chính như app PWA. Không phải file APK hay ứng dụng phát hành trên kho ứng dụng.

## Cách cập nhật repository GitHub `be-vui-hoc` (Cloudflare Pages)

1. **Giải nén ZIP**, tải thư mục `public` và các file ở gốc lên repository GitHub, chọn **Commit changes**. Khi GitHub hỏi có ghi đè file cũ, chọn ghi đè. Nếu công cụ web không cho ghi đè cả thư mục, hãy cập nhật lần lượt nội dung `public/` (đặc biệt `index.html`, `app.js`, `styles.css`, `sw.js`, `audio/`), hoặc dùng GitHub Desktop để đồng bộ.
2. Không cần upload `.github` nếu đã dùng **Cloudflare Pages**; thư mục có dấu chấm đầu tên có thể bị ẩn trong hộp chọn file của Windows.
3. Cloudflare Pages > kết nối GitHub `be-vui-hoc` > **Build output directory = `public`**, framework None, build command trống. Chờ Cloudflare triển khai commit mới.
4. Mở link `*.pages.dev` bằng **Chrome** trên Android, **Safari** trên iPhone. Nếu từng cài bản V2.4, hãy tải lại trang; nếu vẫn hiện bản cũ, xóa dữ liệu website hoặc xóa PWA cũ rồi mở lại link HTTPS. **Lưu ý sao lưu tiến độ trước khi xóa dữ liệu.**

## Những gì có trong V2.5

- Giao diện lớp học sáng, hình cô giáo hoạt hình, nút lớn, phù hợp trẻ chưa đọc tốt.
- Hai hồ sơ độc lập; đổi tên trong **Ba mẹ**, sao thưởng, thống kê, sao lưu/khôi phục dữ liệu JSON.
- Hoạt động tương tác: quan sát → nghe mẫu nếu có giọng → chọn đáp án → tô chữ/số → ôn tập → khen thưởng.
- 29 chữ cái tiếng Việt dưới dạng bài làm quen, các số 0–10, cộng một đơn giản, bốn hình, bốn màu. Nội dung thực hành hỗ trợ chuẩn bị lớp 1, **không thay giáo viên hay thay sách giáo khoa**.
- Thư viện MP3 đi kèm cho lời chào, bài làm quen **chữ a**, một số bước đếm và lời khen. File đã được làm chậm, cân chỉnh âm lượng để **thử cải thiện độ rõ**.
- Các câu của bài mở rộng sử dụng **giọng vi-VN của thiết bị** khi có. Nếu không có giọng, ứng dụng thông báo rõ ràng; không phát một đoạn sai nội dung. **Chưa có bộ giọng giảng dạy chuẩn cho toàn bộ bài học.**
- Chế độ PWA, cache để xem app và bài học đã tải sau khi có kết nối ít nhất một lần. Giọng Web Speech của thiết bị có thể không hoạt động offline.

## Giới hạn trung thực

**V2.5 chưa phải cô giáo AI hội thoại hai chiều.** Giọng MP3 trong V2.5 vẫn là nguồn tổng hợp thử nghiệm từ bản trước, được xử lý âm lượng/tốc độ, **chưa được giáo viên Tiếng Việt xác minh**. Các chữ cái cần phát âm chuẩn để hướng dẫn trẻ; tuyệt đối không dùng nhận dạng giọng nói tự động để kết luận bé phát âm đúng hay sai. Việc đưa website lên GitHub/Cloudflare **không tự tạo ra giọng mới**.

Để có cô giáo nữ tiếng Việt tự nhiên, rõ toàn bộ hàng trăm hoạt động, nhà phát triển cần tích hợp nguồn âm thanh đã tạo và được kiểm duyệt hoặc dịch vụ TTS có chi phí/API được cấu hình **một lần phía máy chủ** (ba mẹ và bé không phải nhập khóa hay thu âm). Phần này chưa được cung cấp trong ZIP và không được mô tả là đã hoàn tất.

Ứng dụng chưa đồng bộ tiến độ giữa các máy: `localStorage` là bộ nhớ riêng trên từng trình duyệt. Nếu bạn sử dụng nhiều thiết bị, dùng sao lưu/khôi phục cho đến khi có backend dữ liệu.

## Cấu trúc

```text
public/index.html             Điểm vào web
public/app.js                 Bài học tương tác, hai hồ sơ, âm thanh
public/styles.css             Giao diện responsive light
public/scene.svg              Tranh lớp học
public/teacher.svg            Nhân vật cô giáo
public/audio/*.mp3            Giọng demo đã xử lý lại (22 tệp)
public/icons/                 Biểu tượng PWA
public/manifest.webmanifest   PWA
public/sw.js                  Offline cache và làm mới phiên bản
.github/workflows/pages.yml   (Tùy chọn) GitHub Pages
```

## Quyền riêng tư

Chưa có tài khoản hoặc máy chủ dữ liệu. Tên và thành tích của hai bé được lưu trên thiết bị, không gửi về backend. Trẻ không cần cung cấp hình ảnh hoặc bản ghi âm. Không nhập dữ liệu nhạy cảm vào repository GitHub công khai.
