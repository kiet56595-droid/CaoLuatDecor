import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export interface CategoryGroup {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

export const CATEGORY_TREE: CategoryGroup[] = [
  {
    id: 'phong-khach',
    name: 'Nội Thất Phòng Khách',
    children: [
      { id: 'sofa-phong-khach', name: 'Sofa Phòng Khách' },
      { id: 'ban-tra', name: 'Bàn Trà' },
      { id: 'ke-tivi', name: 'Kệ Tivi' },
    ],
  },
  {
    id: 'phong-an',
    name: 'Phòng Ăn',
    children: [
      { id: 'ban-an-ghe-an', name: 'Bàn Ăn & Ghế Ăn' },
    ],
  },
  {
    id: 'phong-ngu',
    name: 'Nội Thất Phòng Ngủ',
    children: [
      { id: 'giuong-ngu', name: 'Giường Ngủ' },
      { id: 'tu-quan-ao', name: 'Tủ Quần Áo' },
    ],
  },
  {
    id: 'tu-bep-group',
    name: 'Tủ Bếp',
    children: [
      { id: 'tu-bep', name: 'Tủ Bếp Acrylic & Melamine' },
    ],
  },
  {
    id: 'tre-em',
    name: 'Nội Thất Phòng Em Bé',
    children: [
      { id: 'noi-that-tre-em', name: 'Phòng Ngủ Trẻ Em' },
    ],
  },
  {
    id: 'van-phong',
    name: 'Nội Thất Văn Phòng',
    children: [
      { id: 'noi-that-van-phong', name: 'Bàn Làm Việc & Kệ' },
    ],
  },
  {
    id: 'decor',
    name: 'Đồ Trang Trí',
    children: [
      { id: 'do-decor-trang-tri', name: 'Đồ Decor & Đèn' },
    ],
  },
];

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  // Expand groups that contain the selected category by default
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      'phong-khach': true,
      'phong-an': true,
      'phong-ngu': true,
      'tu-bep-group': true,
      'tre-em': true,
      'van-phong': true,
      'decor': true,
    };
    return initial;
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const totalItems = CATEGORIES.reduce((acc, cat) => acc + cat.itemCount, 0);

  return (
    <aside className="bg-white rounded-lg border border-[#E7DCce] shadow-sm overflow-hidden">
      {/* Sidebar Header */}
      <div className="bg-[#FAF8F5] p-3.5 border-b border-[#E7DCce] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#654329]" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-[#29231F]">
            DANH MỤC SẢN PHẨM
          </h2>
        </div>
        <span className="text-[11px] text-[#877B70] font-medium">
          {totalItems} mẫu
        </span>
      </div>

      {/* All Products Option */}
      <div className="p-2 border-b border-[#F7F3ED]">
        <button
          onClick={() => onSelectCategory('all')}
          className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-between ${
            selectedCategory === 'all'
              ? 'bg-[#654329] text-white shadow-sm'
              : 'text-[#29231F] hover:bg-[#FAF8F5] hover:text-[#654329]'
          }`}
        >
          <span>Tất cả sản phẩm</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#F7F3ED] text-[#877B70]'
          }`}>
            {totalItems}
          </span>
        </button>
      </div>

      {/* Accordion Tree */}
      <div className="p-2 space-y-1">
        {CATEGORY_TREE.map((group) => {
          const isExpanded = !!expandedGroups[group.id];
          const hasSelectedChild = group.children?.some((child) => child.id === selectedCategory);

          return (
            <div key={group.id} className="rounded-md overflow-hidden">
              {/* Group Header Button */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
                  hasSelectedChild
                    ? 'text-[#654329] bg-[#F7F3ED]'
                    : 'text-[#29231F] hover:bg-[#FAF8F5] hover:text-[#654329]'
                }`}
              >
                <span>{group.name}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#877B70]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#877B70]" />
                )}
              </button>

              {/* Children Items */}
              {isExpanded && group.children && (
                <div className="pl-3 pr-1 py-1 space-y-0.5 bg-[#FAF8F5]/60 border-l-2 border-[#D5C3AF] ml-3 my-0.5">
                  {group.children.map((child) => {
                    const isSelected = selectedCategory === child.id;
                    const catData = CATEGORIES.find((c) => c.id === child.id);

                    return (
                      <button
                        key={child.id}
                        onClick={() => onSelectCategory(child.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#654329] text-white font-semibold shadow-sm'
                            : 'text-[#473E37] hover:text-[#654329] hover:bg-white'
                        }`}
                      >
                        <span className="truncate">{child.name}</span>
                        {catData && (
                          <span className={`text-[10px] ml-1.5 ${
                            isSelected ? 'text-[#DFC7A7]' : 'text-[#9E978F]'
                          }`}>
                            ({catData.itemCount})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
