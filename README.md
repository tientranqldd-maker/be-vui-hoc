# BÉ VUI HỌC V2.4 — Web + Mobile (PWA)

Ứng dụng web tĩnh, giao diện dành cho trẻ mầm non chuẩn bị vào lớp 1. Chạy trong trình duyệt trên Android, iPhone, iPad và Windows. Sau khi triển khai HTTPS, có thể **Thêm vào màn hình chính** như một ứng dụng (PWA). Đây **không phải APK / ứng dụng iOS native**.

## Tính năng đã làm

- Hai hồ sơ độc lập cho Bé 1 và Bé 2, đặt lại tên trong khu vực Ba mẹ.
- Hai bài mẫu hoàn chỉnh để thử trải nghiệm: chữ `a` (8 bước) và đếm `1–3` (7 bước), chọn đáp án, tập tô, thưởng sao, lưu tiến độ.
- Giao diện lớp học sáng, hình SVG tích hợp và CSS yêu cầu **chỉ dùng màu sáng** (tuy nhiên một số trình duyệt Xiaomi có chế độ ép màu tối bất chấp thiết kế, nên ưu tiên thử với Chrome).
- Tệp MP3 thật nằm trong `public/audio/`, không dùng `speechSynthesis`. Âm thanh chạy sau thao tác chạm/bấm, không tự phát trước khi người dùng tương tác.
- Có nút **Kiểm tra tiếng cô giáo** ở trang chủ và trình phát MP3 gốc ở góc **Ba mẹ** để chẩn đoán.
- Có PWA manifest + service worker lưu trước trang và MP3 để sử dụng khi mất mạng **sau khi cài đặt / truy cập online thành công**.
- Sao lưu, khôi phục JSON (không có tài khoản, không đồng bộ nhiều thiết bị).

**Giới hạn quan trọng:** Các MP3 hiện lấy từ bộ giọng tổng hợp thử nghiệm V2.3. Chúng chưa được giáo viên xác nhận phát âm chuẩn cho trẻ. Không dùng giọng này để kết luận bé phát âm đúng/sai. Chưa có AI tương tác hai chiều, chưa có chương trình lớp 1 đầy đủ, chưa có đồng bộ đám mây. Bài tập tô đánh giá có thao tác, **không phải chấm đúng nét chữ**.

## Triển khai cách 1: Cloudflare Pages (đề xuất)

1. Tạo repository GitHub mới, ví dụ `be-vui-hoc`. Giải nén ZIP này và **upload các thư mục `public`, `.github` cùng file `README.md` vào gốc repo** (đừng upload nguyên tệp ZIP). Nếu tải trực tiếp qua GitHub Web, cần upload cả thư mục con như `public/audio`.
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**, chọn repository GitHub.
3. Framework preset: `None`. Build command: để trống (hoặc `exit 0`). Build output directory: **`public`**. Root directory: để mặc định.
4. Deploy, mở địa chỉ dạng `https://ten-ung-dung.pages.dev` trên Chrome, kiểm tra nút **🔊 Kiểm tra tiếng cô giáo**.
5. Khi cập nhật code, push GitHub; Cloudflare Pages tự triển khai bản mới.

## Triển khai cách 2: GitHub Pages (không cần Cloudflare)

1. Upload toàn bộ nội dung ZIP vào gốc repository GitHub, nhánh **`main`**. Thư mục `.github/workflows/pages.yml` đã có sẵn quy trình xuất bản.
2. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Tab **Actions** xem workflow **Publish Be Vui Hoc**. Sau khi thành công, website có dạng `https://<tên-tài-khoản>.github.io/<tên-repository>/`.
4. Vì code dùng đường dẫn **tương đối**, nó chạy được cả tại tên miền gốc và đường dẫn con của GitHub Pages.

## Cài như app trên điện thoại

- **Android:** mở link HTTPS bằng Google Chrome → menu ⋮ → **Cài đặt ứng dụng** hoặc **Thêm vào màn hình chính**.
- **iPhone / iPad:** Safari → nút **Chia sẻ** → **Thêm vào màn hình chính**.
- **Windows:** Chrome hoặc Edge → menu → **Cài đặt ứng dụng**, hoặc sử dụng website thông thường.

Không cần đưa file HTML vào thư mục Downloads để chạy, vì `file://` không thể bảo đảm tải được MP3, PWA và các thành phần khác.

## Kiểm tra âm thanh

1. Mở **HTTPS trên Chrome**, tăng *âm lượng đa phương tiện* (không phải âm lượng chuông).
2. Ở trang chủ bấm **🔊 Kiểm tra tiếng cô giáo**. Sau đó thử nút **VÀO LỚP**.
3. Nếu im lặng, vào **Ba mẹ → Kiểm tra âm thanh**, dùng thanh phát MP3 trực tiếp. Nếu thanh phát trực tiếp cũng im, vấn đề có thể là nguồn âm, trình duyệt hoặc thiết bị. Nếu thanh phát được nhưng nút không phát, cần kiểm tra lỗi trình duyệt.
4. Nếu màu tối xuất hiện, mở website bằng **Chrome** và tắt **ép trang web nền tối** trong trình duyệt Xiaomi (nếu có). Web đã yêu cầu `color-scheme: only light`, nhưng không thể tắt mọi chế độ cưỡng ép của trình duyệt từ phía website.

Các MP3 nằm trong `public/audio/`, xem mapping trong `public/app.js`. Để thay bằng giọng người thật/giọng được duyệt, thay đúng tên MP3 tương ứng, giữ định dạng `.mp3`, và cập nhật `VERSION` trong `public/sw.js` để xóa cache cũ.

## Dữ liệu và riêng tư

Tiến độ của hai bé chỉ lưu trong `localStorage` trên thiết bị đang dùng. Hiện không gửi tên bé hoặc kết quả học tập lên máy chủ. Nếu dùng trình duyệt khác hoặc thiết bị khác sẽ không tự có dữ liệu; sử dụng sao lưu/khôi phục JSON. Không nhập thông tin riêng tư vào kho GitHub công khai.

## Cấu trúc dự án

```text
.github/workflows/pages.yml   GitHub Pages tự xuất bản khi push main
public/index.html             Trang web
public/styles.css             Giao diện web/mobile, chế độ sáng
public/app.js                 Bài học, hai bé, âm thanh, sao thưởng
public/scene.svg              Hình lớp học
public/teacher.svg            Hình cô giáo
public/audio/*.mp3            22 đoạn âm thanh demo
public/icons/*.png            Biểu tượng PWA
public/manifest.webmanifest  Cài trên màn hình chính
public/sw.js                  Cache offline
```

## Phạm vi phiên bản

V2.4 là bản dùng thử kỹ thuật web/PWA cho **hai bài mẫu**, không phải ứng dụng đầy đủ theo cả năm học. Chưa triển khai Cloudflare D1/Workers, chưa đồng bộ đám mây và chưa có AI hội thoại. Phiên bản này dành cho phụ huynh kiểm thử tại nhà trước khi làm nội dung giảng dạy chuẩn.
