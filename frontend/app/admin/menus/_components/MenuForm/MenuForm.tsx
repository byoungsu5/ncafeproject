import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MenuFormData } from '@/types';
import { useCategories } from '../CategoryTabs/useCategories';
import OptionSection from './OptionSection';
import ImageUploadSection from './ImageUploadSection';
import styles from './MenuForm.module.css';

interface MenuFormProps {
    defaultValues?: Partial<MenuFormData>;
    onSubmit: (data: MenuFormData) => void;
    isSubmitting?: boolean;
    submitLabel?: string;
}

export default function MenuForm({
    defaultValues,
    onSubmit,
    isSubmitting = false,
    submitLabel = '저장하기'
}: MenuFormProps) {
    const { categories } = useCategories();
    const methods = useForm<MenuFormData>({
        defaultValues: {
            isAvailable: true,
            isSoldOut: false,
            price: 0,
            images: [],
            options: [],
            ...defaultValues
        }
    });

    const { register, handleSubmit, formState: { errors }, watch, setValue } = methods;

    const engName = watch('engName');

    useEffect(() => {
        if (engName) {
            const suggestedSlug = engName.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-');
            
            // Note: In a real app, you might want to only update if slug field is pristine
            setValue('slug', suggestedSlug);
        }
    }, [engName, setValue]);
 
    // 카테고리 로드 시 초기값 동기화
    useEffect(() => {
        if (categories.length > 0 && defaultValues?.categoryId) {
            setValue('categoryId', String(defaultValues.categoryId));
        }
    }, [categories, defaultValues, setValue]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* 기본 정보 섹션 */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>기본 정보</h2>
                        <p className={styles.sectionDescription}>메뉴의 이름, 가격, 카테고리 등 기본 정보를 입력해주세요.</p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                한글 메뉴명 <span className={styles.required}>*</span>
                            </label>
                            <input
                                {...register('korName', { required: '한글 메뉴명을 입력해주세요' })}
                                className={styles.input}
                                placeholder="예: 아메리카노"
                            />
                            {errors.korName && <span className={styles.error}>{errors.korName.message}</span>}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                영문 메뉴명 <span className={styles.required}>*</span>
                            </label>
                            <input
                                {...register('engName', { required: '영문 메뉴명을 입력해주세요' })}
                                className={styles.input}
                                placeholder="예: Americano"
                            />
                            {errors.engName && <span className={styles.error}>{errors.engName.message}</span>}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                슬러그 (URL 주소) <span className={styles.required}>*</span>
                            </label>
                            <input
                                {...register('slug', {
                                    required: '슬러그를 입력해주세요',
                                    pattern: {
                                        value: /^[a-z0-9-]+$/,
                                        message: '영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다'
                                    }
                                })}
                                className={styles.input}
                                placeholder="예: iced-americano"
                            />
                            {errors.slug && <span className={styles.error}>{errors.slug.message}</span>}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                카테고리 <span className={styles.required}>*</span>
                            </label>
                            <select
                                {...register('categoryId', { required: '카테고리를 선택해주세요' })}
                                className={styles.select}
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <span className={styles.error}>{errors.categoryId.message}</span>}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                가격 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                {...register('price', {
                                    required: '가격을 입력해주세요',
                                    min: { value: 0, message: '가격은 0원 이상이어야 합니다' },
                                    valueAsNumber: true
                                })}
                                className={styles.input}
                                placeholder="0"
                            />
                            {errors.price && <span className={styles.error}>{errors.price.message}</span>}
                        </div>

                        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>설명</label>
                            <textarea
                                {...register('description')}
                                className={styles.textarea}
                                placeholder="메뉴에 대한 설명을 입력해주세요."
                            />
                        </div>
                    </div>
                </section>

                {/* 이미지 업로드 섹션 */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>메뉴 이미지</h2>
                        <p className={styles.sectionDescription}>메뉴를 대표하는 이미지를 등록해주세요 (첫 번째 이미지가 대표 이미지가 됩니다).</p>
                    </div>
                    <ImageUploadSection />
                </section>

                {/* 옵션 관리 섹션 */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>옵션 관리</h2>
                        <p className={styles.sectionDescription}>사이즈, 샷 추가 등 메뉴의 옵션을 설정하세요.</p>
                    </div>
                    <OptionSection />
                </section>

                {/* 판매 설정 섹션 */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>판매 설정</h2>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.fieldGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                {...register('isSoldOut')}
                                id="isSoldOut"
                                style={{ width: '1rem', height: '1rem' }}
                            />
                            <label htmlFor="isSoldOut" className={styles.label} style={{ cursor: 'pointer' }}>
                                품절 상태로 설정
                            </label>
                        </div>

                        <div className={styles.fieldGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                {...register('isAvailable')}
                                id="isAvailable"
                                style={{ width: '1rem', height: '1rem' }}
                            />
                            <label htmlFor="isAvailable" className={styles.label} style={{ cursor: 'pointer' }}>
                                메뉴 노출 (체크 시 고객에게 보임)
                            </label>
                        </div>
                    </div>
                </section>

                {/* 버튼 */}
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '저장 중...' : submitLabel}
                </button>
            </form>
        </FormProvider>
    );
}
