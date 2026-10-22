import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, Star, Image as ImageIcon, Link as LinkIcon, Loader2, Check } from 'lucide-react';

interface ProductImagesManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ProductImagesManager: React.FC<ProductImagesManagerProps> = ({
  images,
  onChange,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Thêm ảnh từ URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  // 2. Nén ảnh và chuyển thành Data URL an toàn
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Giới hạn độ phân giải tối đa 1200px để tối ưu dung lượng
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Nén JPEG chất lượng 82%
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // 3. Xử lý tải ảnh từ máy tính (hỗ trợ chọn nhiều file cùng lúc)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const dataUrl = await processImageFile(file);
          newImages.push(dataUrl);
        } catch (err) {
          console.warn('Lỗi đọc file ảnh:', err);
        }
      }
    }

    setIsProcessing(false);
    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }

    // Reset input để có thể chọn lại cùng file nếu muốn
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 4. Xóa ảnh
  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  // 5. Đặt làm ảnh đại diện chính (đưa lên đầu danh sách)
  const handleSetPrimary = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    const selected = images[indexToPrimary];
    const remaining = images.filter((_, idx) => idx !== indexToPrimary);
    onChange([selected, ...remaining]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#877B70] uppercase">
          Hình ảnh sản phẩm ({images.length} ảnh)
        </label>
        <span className="text-[11px] text-[#B5A090]">Ảnh đầu tiên là ảnh đại diện chính</span>
      </div>

      {/* Grid danh sách ảnh hiện tại */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#FAF8F5] border border-[#E7DCce] rounded-xl max-h-56 overflow-y-auto">
          {images.map((imgUrl, index) => {
            const isPrimary = index === 0;
            return (
              <div
                key={index}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 bg-white transition-all ${
                  isPrimary
                    ? 'border-[#654329] shadow-md ring-2 ring-[#654329]/20'
                    : 'border-gray-200 hover:border-[#C5A880]'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Badge Ảnh đại diện */}
                {isPrimary ? (
                  <span className="absolute top-1.5 left-1.5 bg-[#654329] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    Ảnh chính
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-[#654329] text-white text-[10px] px-1.5 py-0.5 rounded transition-all flex items-center gap-1 shadow"
                    title="Đặt làm ảnh đại diện"
                  >
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>Làm ảnh chính</span>
                  </button>
                )}

                {/* Nút Xóa ảnh */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md opacity-80 hover:opacity-100 transition-opacity shadow"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#D5C3AF] rounded-xl p-6 text-center bg-[#FAF8F5]">
          <ImageIcon className="w-8 h-8 text-[#B5A090] mx-auto mb-2" />
          <p className="text-xs font-semibold text-[#473E37]">Chưa có hình ảnh nào cho sản phẩm</p>
          <p className="text-[11px] text-[#877B70] mt-0.5">
            Tải ảnh từ máy tính hoặc dán link URL bên dưới để khách hàng xem chi tiết.
          </p>
        </div>
      )}

      {/* Bộ điều khiển thêm ảnh: Chọn tải file HOẶC nhập URL */}
      <div className="bg-white border border-[#E7DCce] rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-[#654329] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải ảnh từ máy tính</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-[#654329] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Thêm bằng Link ảnh (URL)</span>
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
              id="file-product-upload"
            />
            <label
              htmlFor="file-product-upload"
              className={`w-full border border-dashed border-[#654329] hover:bg-[#FAF8F5] text-[#654329] rounded-lg py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                isProcessing ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý hình ảnh...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Chọn 1 hoặc nhiều ảnh từ máy tính (JPG, PNG, WebP)</span>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="Dán đường dẫn ảnh (ví dụ: https://images.unsplash.com/...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-[#D5C3AF] rounded-lg text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#654329]"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="px-3 py-1.5 bg-[#654329] text-white rounded-lg text-xs font-semibold hover:bg-[#533722] disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm ảnh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
