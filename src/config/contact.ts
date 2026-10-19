/**
 * ==============================================================================
 * CAO LUẬT DECOR NỘI THẤT — FILE CẤU HÌNH LIÊN HỆ DUY NHẤT (SINGLE SOURCE OF TRUTH)
 * ==============================================================================
 * HƯỚNG DẪN CẬP NHẬT:
 * Bạn chỉ cần chỉnh sửa thông tin tại file này, toàn bộ Header, Footer, Trang liên hệ,
 * Nút nổi (Floating Widget) và Trang chi tiết sản phẩm sẽ tự động cập nhật đồng bộ.
 * 
 * Lưu ý: Các giá trị mẫu dưới đây được gắn cờ isConfigured = false.
 * Khi thay thông tin thật của quý doanh nghiệp, hãy đổi isConfigured = true!
 */

export interface ContactConfig {
  brandName: string;
  brandShortName: string;
  slogan: string;
  description: string;
  hotline: {
    display: string;
    raw: string; // Số dùng cho liên kết tel: (viết liền không dấu cách, vd: "0901234567")
    isConfigured: boolean;
  };
  zalo: {
    display: string;
    url: string; // vd: "https://zalo.me/0901234567"
    isConfigured: boolean;
  };
  facebook: {
    name: string;
    url: string; // vd: "https://www.facebook.com/caoluatdecor"
    isConfigured: boolean;
  };
  email: {
    display: string;
    url: string; // vd: "contact@caoluatdecor.vn"
    isConfigured: boolean;
  };
  showroom: {
    address: string;
    districtCity: string;
    fullAddress: string;
    googleMapsUrl: string; // Link chia sẻ vị trí Google Maps thực tế
    googleMapsEmbedUrl?: string; // Link embed iframe bản đồ nếu có
    isConfigured: boolean;
  };
  workshop: {
    address: string;
    isConfigured: boolean;
  };
  workingHours: {
    weekdays: string;
    sunday: string;
  };
  copyrightYear: number;
}

export const CONTACT_INFO: ContactConfig = {
  brandName: "CAO LUẬT DECOR NỘI THẤT",
  brandShortName: "Cao Luật Decor",
  slogan: "Kiến tạo không gian sống đậm chất riêng",
  description:
    "Đơn vị chuyên tư vấn, thiết kế và thi công nội thất trọn gói cao cấp. Với cam kết chất lượng chuẩn xưởng, vật liệu tuyển chọn và bảo hành uy tín.",

  // Hotline / Điện thoại
  hotline: {
    display: "09xx.xxx.xxx (Cần cập nhật)",
    raw: "0900000000",
    isConfigured: false, // Đổi thành true khi nhập số thật
  },

  // Zalo tư vấn & báo giá
  zalo: {
    display: "Zalo Cao Luật Decor",
    url: "https://zalo.me/", // Cập nhật link Zalo thật (vd: https://zalo.me/0901234567)
    isConfigured: false,
  },

  // Fanpage Facebook
  facebook: {
    name: "Cao Luật Decor Nội Thất",
    url: "https://facebook.com/", // Cập nhật URL Fanpage thật
    isConfigured: false,
  },

  // Hộp thư điện tử
  email: {
    display: "lienhe@caoluatdecor.vn (Cần cập nhật)",
    url: "lienhe@caoluatdecor.vn",
    isConfigured: false,
  },

  // Showroom trưng bày
  showroom: {
    address: "Số [Đang cập nhật], Đường [Đang cập nhật]",
    districtCity: "TP. Hồ Chí Minh",
    fullAddress: "Số [Đang cập nhật], Đường [Đang cập nhật], TP. Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=Ho+Chi+Minh+City",
    // Embed map trung tâm TP.HCM làm mẫu mặc định
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125433.89679090623!2d106.633831!3d10.776889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e42c671%3A0x9c32bed4e4b537a4!2zSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
    isConfigured: false,
  },

  // Xưởng sản xuất nội thất
  workshop: {
    address: "Xưởng sản xuất Cao Luật Decor: Khu công nghiệp / Làng nghề mộc [Cần cập nhật]",
    isConfigured: false,
  },

  // Giờ làm việc & mở cửa showroom
  workingHours: {
    weekdays: "08:00 - 18:00 (Thứ 2 - Thứ 7)",
    sunday: "08:30 - 17:00 (Chủ nhật)",
  },

  copyrightYear: new Date().getFullYear(),
};

/**
 * Trợ giúp tạo link liên hệ an toàn
 */
export const getTelHref = () => `tel:${CONTACT_INFO.hotline.raw}`;
export const getMailtoHref = (subject = "Tư vấn nội thất Cao Luật Decor") =>
  `mailto:${CONTACT_INFO.email.url}?subject=${encodeURIComponent(subject)}`;
export const getZaloHref = () => CONTACT_INFO.zalo.url;
export const getFacebookHref = () => CONTACT_INFO.facebook.url;
export const getMapsHref = () => CONTACT_INFO.showroom.googleMapsUrl;
