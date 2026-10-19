import React, { useState } from 'react';
import { Info, X, ExternalLink } from 'lucide-react';
import { CONTACT_INFO } from '../../config/contact';

export const ConfigNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  const hasUnconfiguredFields =
    !CONTACT_INFO.hotline.isConfigured ||
    !CONTACT_INFO.zalo.isConfigured ||
    !CONTACT_INFO.email.isConfigured ||
    !CONTACT_INFO.showroom.isConfigured;

  if (dismissed || !hasUnconfiguredFields) {
    return null;
  }

  return (
    <aside
      aria-label="Thông báo chế độ demo"
      className="bg-[#654329] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#DFC7A7]/30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#DFC7A7] shrink-0" />
          <span>
            <strong>Bản thử nghiệm (Demo Website):</strong> Thông tin liên hệ, hotline, showroom đang dùng dữ liệu mẫu. Để thay đổi thông tin chính thức, vui lòng cập nhật file <code className="bg-[#432C1B] px-1.5 py-0.5 rounded text-[#DFC7A7] font-mono">src/config/contact.ts</code>.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#DFC7A7] hover:text-white p-1 transition-colors shrink-0"
          title="Đóng thông báo"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
