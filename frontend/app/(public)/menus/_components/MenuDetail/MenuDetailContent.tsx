import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard, ListChecks } from 'lucide-react';
import { useCartStore } from '@/src/entities/cart/model/store';
import styles from './MenuDetailContent.module.css';
import { useCartConfirmModal } from '@/src/shared/ui/CartConfirmModal/useCartConfirmModal';
import { useOrderModal } from '@/src/shared/ui/OrderModal/useOrderModal';

interface OptionItem {
    id: number;
    name: string;
    priceDelta: number;
    sortOrder: number;
}

interface MenuOption {
    id: number;
    name: string;
    type: string;
    required: boolean;
    sortOrder: number;
    items: OptionItem[];
}

interface MenuDetailContentProps {
    id: number;
    korName: string;
    engName: string;
    price: number;
    categoryName: string;
    description: string;
    imageSrc: string;
    isAvailable: boolean;
    isSoldOut: boolean;
    options?: MenuOption[];
}

export default function MenuDetailContent({
    id,
    korName,
    engName,
    price,
    categoryName,
    description,
    imageSrc,
    isAvailable,
    isSoldOut,
    options = [],
}: MenuDetailContentProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isOrdering, setIsOrdering] = useState(false);
    const router = useRouter();
    const openCartModal = useCartConfirmModal((state) => state.open);
    const openOrderModal = useOrderModal((state) => state.open);
    const closeOrderModal = useOrderModal((state) => state.close);

    // 옵션 선택 상태 관리
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number[]>>({});

    const handleSingleSelect = (optionId: number, itemId: number) => {
        setSelectedOptions(prev => ({ ...prev, [optionId]: [itemId] }));
    };

    const handleMultipleSelect = (optionId: number, itemId: number) => {
        setSelectedOptions(prev => {
            const current = prev[optionId] || [];
            if (current.includes(itemId)) {
                return { ...prev, [optionId]: current.filter(id => id !== itemId) };
            }
            return { ...prev, [optionId]: [...current, itemId] };
        });
    };

    // 추가금 합산
    const extraPrice = options.reduce((total, opt) => {
        const selected = selectedOptions[opt.id] || [];
        return total + opt.items
            .filter(item => selected.includes(item.id))
            .reduce((sum, item) => sum + (item.priceDelta || 0), 0);
    }, 0);

    const totalPrice = price + extraPrice;

    const handleAddToCart = () => {
        if (!isAvailable || isSoldOut) return;

        addItem({
            id,
            korName,
            engName,
            price: totalPrice,
            imageSrc,
        });
        openCartModal(korName);
    };

    const handleOrderNow = async () => {
        if (!isAvailable || isSoldOut || isOrdering) return;

        openOrderModal({
            type: 'confirm',
            title: '주문 확인 🔥',
            message: `${korName}을(를) 바로 주문하시겠어요?`,
            onConfirm: performOrder,
        });
    };

    const performOrder = async () => {
        setIsOrdering(true);
        closeOrderModal();
        
        try {
            const orderRequest = {
                items: [
                    {
                        menuId: id,
                        menuName: korName,
                        price: totalPrice,
                        quantity: 1,
                    },
                ],
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderRequest),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || '주문 중 오류가 발생했습니다.');
            }

            const order = await response.json();
            
            // 주문 생성 성공 후 결제 모달 오픈
            openOrderModal({
                type: 'payment',
                title: '결제하기 💳',
                message: '결제 수단을 선택하고 주문을 완료하세요.',
                orderId: order.id,
                amount: totalPrice,
                onPaymentSuccess: (payment) => {
                    openOrderModal({
                        type: 'success',
                        title: '주문 및 결제 완료! 🔥',
                        message: '파르게 결제가 완료되었습니다. 파이리가 맛있게 준비해드릴게요!',
                        orderId: order.id,
                        onClose: () => router.push('/'),
                    });
                }
            });
        } catch (error: any) {
            openOrderModal({
                type: 'error',
                title: '주문 실패… 🔥',
                message: error.message,
            });
        } finally {
            setIsOrdering(false);
        }
    };

    const disabled = !isAvailable || isSoldOut;
    return (
        <div className={styles.content}>
            <span className={styles.category}>{categoryName}</span>
            <h1 className={styles.korName}>{korName}</h1>
            <p className={styles.engName}>{engName}</p>
            <p className={styles.price}>
                {totalPrice.toLocaleString()}원
                {extraPrice > 0 && (
                    <span className={styles.extraPrice}> (+{extraPrice.toLocaleString()}원)</span>
                )}
            </p>

            {description && (
                <div className={styles.descriptionSection}>
                    <h2 className={styles.sectionTitle}>설명</h2>
                    <p className={styles.description}>{description}</p>
                </div>
            )}

            {/* 옵션 선택 UI */}
            {options.length > 0 && (
                <div className={styles.optionsSection}>
                    <h2 className={styles.sectionTitle}>
                        <ListChecks size={14} />
                        옵션 선택
                    </h2>
                    {options.map(opt => (
                        <div key={opt.id} className={styles.optionGroup}>
                            <div className={styles.optionGroupLabel}>
                                <span className={styles.optionName}>{opt.name}</span>
                                <div className={styles.optionMeta}>
                                    <span className={styles.optionTypeBadge}>
                                        {opt.type === 'single' ? '1개 선택' : '복수 선택'}
                                    </span>
                                    {opt.required && <span className={styles.requiredBadge}>필수</span>}
                                </div>
                            </div>
                            <div className={styles.optionItems}>
                                {opt.items.map(item => {
                                    const isSelected = (selectedOptions[opt.id] || []).includes(item.id);
                                    return (
                                        <label
                                            key={item.id}
                                            className={`${styles.optionItem} ${isSelected ? styles.optionItemSelected : ''}`}
                                        >
                                            <input
                                                type={opt.type === 'single' ? 'radio' : 'checkbox'}
                                                name={`option-${opt.id}`}
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (opt.type === 'single') {
                                                        handleSingleSelect(opt.id, item.id);
                                                    } else {
                                                        handleMultipleSelect(opt.id, item.id);
                                                    }
                                                }}
                                                className={styles.optionInput}
                                            />
                                            <span className={styles.optionItemName}>{item.name}</span>
                                            {item.priceDelta > 0 && (
                                                <span className={styles.optionItemPrice}>
                                                    +{item.priceDelta.toLocaleString()}원
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.actionButtons}>
                <button 
                    className={styles.cartBtn} 
                    onClick={handleAddToCart}
                    disabled={disabled || isOrdering}
                >
                    <ShoppingCart size={20} />
                    {disabled ? '품절' : '장바구니 담기'}
                </button>
                <button 
                    className={styles.orderBtn}
                    onClick={handleOrderNow}
                    disabled={disabled || isOrdering}
                >
                    <CreditCard size={20} />
                    {disabled ? '품절' : isOrdering ? '처리 중...' : '바로 주문하기'}
                </button>
            </div>
        </div>
    );
}

