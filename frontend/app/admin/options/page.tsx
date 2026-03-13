'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    ListChecks, Plus, Trash2, X, Save,
    GripVertical, CheckCircle, AlertCircle, Grid3X3, Loader2
} from 'lucide-react';
import { fetchAPI } from '@/app/lib/api';
import styles from './page.module.css';

// ── Types ──
interface OptionItemData {
    id?: number;
    name: string;
    priceDelta: number;
    sortOrder: number;
}

interface OptionGroupData {
    id?: number;
    name: string;
    type: 'single' | 'multiple';
    required: boolean;
    sortOrder: number;
    items: OptionItemData[];
}

interface MenuListItem {
    id: number;
    korName: string;
    engName: string;
    price: number;
    categoryName: string;
    isAvailable: boolean;
}

interface Category {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
    menuCount: number;
}

// ── Toast Component ──
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${type === 'success' ? styles.toastSuccess : styles.toastError}`}>
            {type === 'success' ? <CheckCircle size={18} color="#22c55e" /> : <AlertCircle size={18} color="#ef4444" />}
            <span className={styles.toastMessage}>{message}</span>
        </div>
    );
}

export default function OptionsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [menus, setMenus] = useState<MenuListItem[]>([]);
    const [options, setOptions] = useState<OptionGroupData[]>([]);
    const [originalOptions, setOriginalOptions] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // 카테고리 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/admin/categories');
                if (!response.ok) return;
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error('카테고리 로드 실패:', err);
            }
        };
        fetchCategories();
    }, []);

    // 메뉴 목록 불러오기
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await fetchAPI('/admin/menus');
                if (data?.menus) {
                    setMenus(data.menus);
                }
            } catch (err) {
                console.error('메뉴 목록 로드 실패:', err);
            }
        };
        fetchMenus();
    }, []);

    // 선택된 카테고리의 메뉴들
    const categoryMenus = menus.filter(
        m => m.categoryName === categories.find(c => c.id === selectedCategoryId)?.name
    );

    // 카테고리 선택 시 → 첫 번째 메뉴의 옵션을 기준 템플릿으로 불러오기
    const fetchCategoryOptions = useCallback(async (catId: number) => {
        const catName = categories.find(c => c.id === catId)?.name;
        if (!catName) return;

        const catMenus = menus.filter(m => m.categoryName === catName);
        if (catMenus.length === 0) {
            setOptions([]);
            setOriginalOptions(JSON.stringify([]));
            return;
        }

        setLoading(true);
        try {
            // 첫 번째 메뉴의 옵션을 기준으로 불러온다
            const data = await fetchAPI(`/admin/menus/${catMenus[0].id}`);
            const opts: OptionGroupData[] = (data.options || []).map((o: any, i: number) => ({
                id: o.id,
                name: o.name || '',
                type: o.type || 'single',
                required: o.required ?? o.isRequired ?? false,
                sortOrder: o.sortOrder ?? i,
                items: (o.items || []).map((item: any, j: number) => ({
                    id: item.id,
                    name: item.name || '',
                    priceDelta: item.priceDelta ?? 0,
                    sortOrder: item.sortOrder ?? j,
                })),
            }));
            setOptions(opts);
            setOriginalOptions(JSON.stringify(opts));
        } catch (err) {
            console.error('옵션 로드 실패:', err);
            setToast({ message: '옵션을 불러오지 못했습니다.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [categories, menus]);

    useEffect(() => {
        if (selectedCategoryId && menus.length > 0 && categories.length > 0) {
            fetchCategoryOptions(selectedCategoryId);
        } else {
            setOptions([]);
            setOriginalOptions('');
        }
    }, [selectedCategoryId, menus, categories, fetchCategoryOptions]);

    const hasChanges = JSON.stringify(options) !== originalOptions;

    // ── Option Group CRUD ──
    const addOptionGroup = () => {
        setOptions(prev => [...prev, {
            name: '',
            type: 'single',
            required: false,
            sortOrder: prev.length,
            items: [{ name: '', priceDelta: 0, sortOrder: 0 }],
        }]);
    };

    const removeOptionGroup = (index: number) => {
        setOptions(prev => prev.filter((_, i) => i !== index));
    };

    const updateOptionGroup = (index: number, field: keyof OptionGroupData, value: any) => {
        setOptions(prev => prev.map((opt, i) => i === index ? { ...opt, [field]: value } : opt));
    };

    // ── Option Item CRUD ──
    const addOptionItem = (groupIndex: number) => {
        setOptions(prev => prev.map((opt, i) => {
            if (i !== groupIndex) return opt;
            return {
                ...opt,
                items: [...opt.items, { name: '', priceDelta: 0, sortOrder: opt.items.length }],
            };
        }));
    };

    const removeOptionItem = (groupIndex: number, itemIndex: number) => {
        setOptions(prev => prev.map((opt, i) => {
            if (i !== groupIndex) return opt;
            return { ...opt, items: opt.items.filter((_, j) => j !== itemIndex) };
        }));
    };

    const updateOptionItem = (groupIndex: number, itemIndex: number, field: keyof OptionItemData, value: any) => {
        setOptions(prev => prev.map((opt, i) => {
            if (i !== groupIndex) return opt;
            return {
                ...opt,
                items: opt.items.map((item, j) => j === itemIndex ? { ...item, [field]: value } : item),
            };
        }));
    };

    // ── Save: 카테고리 내 모든 메뉴에 일괄 적용 ──
    const handleSave = async () => {
        if (!selectedCategoryId) return;

        for (const opt of options) {
            if (!opt.name.trim()) {
                setToast({ message: '옵션 그룹 이름을 입력해주세요.', type: 'error' });
                return;
            }
            for (const item of opt.items) {
                if (!item.name.trim()) {
                    setToast({ message: '옵션 항목 이름을 입력해주세요.', type: 'error' });
                    return;
                }
            }
        }

        const targetMenus = categoryMenus;
        if (targetMenus.length === 0) {
            setToast({ message: '해당 카테고리에 메뉴가 없습니다.', type: 'error' });
            return;
        }

        setSaving(true);
        setSaveProgress({ current: 0, total: targetMenus.length });

        const optionsPayload = options.map((opt, i) => ({
            id: opt.id,
            name: opt.name,
            type: opt.type,
            required: opt.required,
            sortOrder: i,
            items: opt.items.map((item, j) => ({
                id: item.id,
                name: item.name,
                priceDelta: Number(item.priceDelta) || 0,
                sortOrder: j,
            })),
        }));

        let successCount = 0;
        let failCount = 0;

        for (let idx = 0; idx < targetMenus.length; idx++) {
            const menu = targetMenus[idx];
            setSaveProgress({ current: idx + 1, total: targetMenus.length });

            try {
                const menuData = await fetchAPI(`/admin/menus/${menu.id}`);
                await fetchAPI(`/admin/menus/${menu.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        korName: menuData.korName,
                        engName: menuData.engName,
                        slug: menuData.slug,
                        description: menuData.description,
                        price: menuData.price,
                        categoryId: menuData.categoryId,
                        isAvailable: menuData.isAvailable,
                        options: optionsPayload,
                    }),
                });
                successCount++;
            } catch (err) {
                console.error(`${menu.korName} 옵션 저장 실패:`, err);
                failCount++;
            }
        }

        if (failCount === 0) {
            setToast({
                message: `${successCount}개 메뉴에 옵션이 일괄 적용되었습니다!`,
                type: 'success',
            });
        } else {
            setToast({
                message: `${successCount}개 성공, ${failCount}개 실패`,
                type: 'error',
            });
        }

        // 최신 상태 다시 로드
        await fetchCategoryOptions(selectedCategoryId);
        setSaving(false);
        setSaveProgress({ current: 0, total: 0 });
    };

    const handleCancel = () => {
        if (selectedCategoryId) {
            fetchCategoryOptions(selectedCategoryId);
        }
    };

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    return (
        <main className={styles.page}>
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />

            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.title}>
                            <span className={styles.titleIcon}><ListChecks size={22} /></span>
                            옵션 관리
                        </h1>
                    </div>
                    <p className={styles.subtitle}>카테고리를 선택하면 해당 카테고리의 모든 메뉴에 옵션이 일괄 적용됩니다.</p>
                </header>

                {/* Category Tabs */}
                <div className={styles.categorySection}>
                    <div className={styles.categorySectionLabel}>
                        <Grid3X3 size={16} />
                        카테고리 선택
                    </div>
                    <div className={styles.categoryTabs}>
                        {categories.map(cat => {
                            const count = menus.filter(m => m.categoryName === cat.name).length;
                            return (
                                <button
                                    key={cat.id}
                                    className={`${styles.categoryTab} ${selectedCategoryId === cat.id ? styles.categoryTabActive : ''}`}
                                    onClick={() => setSelectedCategoryId(cat.id)}
                                >
                                    {cat.icon && <span className={styles.categoryIcon}>{cat.icon}</span>}
                                    {cat.name}
                                    <span className={styles.categoryTabCount}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Category Info Banner */}
                {selectedCategoryId && !loading && (
                    <div className={styles.categoryInfo}>
                        <div className={styles.categoryInfoLeft}>
                            <span className={styles.categoryInfoIcon}>{selectedCategory?.icon}</span>
                            <div>
                                <div className={styles.categoryInfoTitle}>{selectedCategory?.name} 카테고리</div>
                                <div className={styles.categoryInfoDesc}>
                                    아래 옵션을 저장하면 <strong>{categoryMenus.length}개 메뉴</strong>에 동시에 적용됩니다.
                                </div>
                            </div>
                        </div>
                        <div className={styles.categoryMenuList}>
                            {categoryMenus.map(m => (
                                <span key={m.id} className={styles.categoryMenuItem}>{m.korName}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Options Card */}
                {!selectedCategoryId ? (
                    <div className={styles.optionsCard}>
                        <div className={styles.selectPrompt}>
                            <div className={styles.selectPromptIcon}><Grid3X3 size={32} /></div>
                            <p className={styles.selectPromptText}>
                                위에서 카테고리를 선택하면<br/>해당 카테고리의 옵션을 일괄 관리할 수 있습니다.
                            </p>
                        </div>
                    </div>
                ) : loading ? (
                    <div className={styles.optionsCard}>
                        <div className={styles.loadingState}>옵션을 불러오는 중...</div>
                    </div>
                ) : (
                    <>
                        <div className={styles.optionsCard}>
                            <div className={styles.optionsHeader}>
                                <div className={styles.optionsTitle}>
                                    <span className={styles.optionMenuName}>{selectedCategory?.icon} {selectedCategory?.name}</span>
                                    옵션
                                    <span className={styles.optionCount}>{options.length}</span>
                                </div>
                                <button className={styles.addOptionBtn} onClick={addOptionGroup}>
                                    <Plus size={16} />
                                    옵션 그룹 추가
                                </button>
                            </div>

                            {options.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}><ListChecks size={28} /></div>
                                    <div className={styles.emptyTitle}>등록된 옵션이 없습니다</div>
                                    <p className={styles.emptyDesc}>
                                        &quot;옵션 그룹 추가&quot; 버튼을 눌러<br />
                                        사이즈, 샷 추가 등 옵션을 만들어보세요.
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.optionsList}>
                                    {options.map((opt, gi) => (
                                        <div key={gi} className={styles.optionGroup}>
                                            {/* Group Header */}
                                            <div className={styles.optionGroupHeader}>
                                                <div className={styles.optionGroupInfo}>
                                                    <GripVertical size={16} className={styles.dragHandle} />
                                                    <input
                                                        type="text"
                                                        className={styles.optionNameInput}
                                                        placeholder="옵션 그룹명 (예: 사이즈, 온도)"
                                                        value={opt.name}
                                                        onChange={e => updateOptionGroup(gi, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className={styles.optionGroupControls}>
                                                    <select
                                                        className={styles.typeSelect}
                                                        value={opt.type}
                                                        onChange={e => updateOptionGroup(gi, 'type', e.target.value)}
                                                    >
                                                        <option value="single">단일 선택</option>
                                                        <option value="multiple">다중 선택</option>
                                                    </select>
                                                    <button
                                                        className={`${styles.requiredToggle} ${opt.required ? styles.active : ''}`}
                                                        onClick={() => updateOptionGroup(gi, 'required', !opt.required)}
                                                    >
                                                        {opt.required ? '✓ 필수' : '선택'}
                                                    </button>
                                                    <button
                                                        className={styles.deleteGroupBtn}
                                                        onClick={() => removeOptionGroup(gi)}
                                                        title="그룹 삭제"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div className={styles.optionItems}>
                                                {opt.items.map((item, ii) => (
                                                    <div key={ii} className={styles.optionItemRow}>
                                                        <input
                                                            type="text"
                                                            className={styles.itemNameInput}
                                                            placeholder="항목명 (예: Large)"
                                                            value={item.name}
                                                            onChange={e => updateOptionItem(gi, ii, 'name', e.target.value)}
                                                        />
                                                        <div className={styles.itemPriceWrapper}>
                                                            <input
                                                                type="number"
                                                                className={styles.itemPriceInput}
                                                                placeholder="0"
                                                                value={item.priceDelta}
                                                                onChange={e => updateOptionItem(gi, ii, 'priceDelta', Number(e.target.value))}
                                                            />
                                                            <span className={styles.priceUnit}>원</span>
                                                        </div>
                                                        <button
                                                            className={styles.deleteItemBtn}
                                                            onClick={() => removeOptionItem(gi, ii)}
                                                            title="항목 삭제"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button className={styles.addItemBtn} onClick={() => addOptionItem(gi)}>
                                                    <Plus size={14} />
                                                    항목 추가
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Save Bar */}
                        {hasChanges && (
                            <div className={styles.saveBar}>
                                <div className={styles.saveBarInfo}>
                                    {saving ? (
                                        <span className={styles.saveProgressText}>
                                            <Loader2 size={14} className={styles.spinIcon} />
                                            {saveProgress.current}/{saveProgress.total}개 메뉴 적용 중...
                                        </span>
                                    ) : (
                                        <span className={styles.saveBarHint}>
                                            {categoryMenus.length}개 메뉴에 일괄 적용됩니다
                                        </span>
                                    )}
                                </div>
                                <div className={styles.saveBarActions}>
                                    <button className={styles.cancelBtn} onClick={handleCancel} disabled={saving}>
                                        취소
                                    </button>
                                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                        <Save size={16} />
                                        {saving ? '적용 중...' : `${categoryMenus.length}개 메뉴에 저장`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </main>
    );
}
