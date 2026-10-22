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
    raw: string; // Số dùng cho liên kết tel: (viết liền không dấu cách, vd: "0708.678.995")
    isConfigured: boolean;
  };
  zalo: {
    display: string;
    url: string; // vd: "https://zalo.me/0708678995"
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
    display: "0708678995",
    raw: "0708678995",
    isConfigured: true,
  },

  // Zalo tư vấn & báo giá
  zalo: {
    display: "Zalo Cao Luật Decor",
    url: "https://zalo.me/0708678995",
    isConfigured: true,
  },

  // Fanpage Facebook
  facebook: {
    name: "Cao Luật Decor Nội Thất",
    url: "https://www.facebook.com/profile.php?id=100094081195645",
    isConfigured: true,
  },

  // Hộp thư điện tử
  email: {
    display: "lienhe@caoluatdecor.vn",
    url: "lienhe@caoluatdecor.vn",
    isConfigured: true,
  },

  // Showroom trưng bày
  showroom: {
    address: "34/2H2 Đường Vĩnh Phú 41",
    districtCity: "Thuận An, Bình Dương",
    fullAddress: "34/2H2 Đường Vĩnh Phú 41, P. Vĩnh Phú, Thuận An, Bình Dương",
    googleMapsUrl: "https://maps.google.com/?q=10.88548,106.70031",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=10.88548,106.70031&hl=vi&z=16&output=embed",
    isConfigured: true,
  },

  // Xưởng sản xuất nội thất
  workshop: {
    address: "Xưởng sản xuất Cao Luật Decor: Bình Chánh, TP. Hồ Chí Minh",
    isConfigured: true,
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
export const getFacebookEmbedUrl = (width = 340, height = 288) => {
  const encodedUrl = encodeURIComponent(CONTACT_INFO.facebook.url);
  return `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=${width}&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&lazy=true`;
};
export const getMapsHref = () => CONTACT_INFO.showroom.googleMapsUrl;
