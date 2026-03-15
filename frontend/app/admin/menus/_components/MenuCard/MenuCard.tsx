import { Menu } from '@/types';
import styles from './MenuCard.module.css';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { Edit, Trash, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { MenuResponse } from '../MenuList/useMenus';
import { toast } from 'react-hot-toast';

interface MenuCardProps {
    menu: MenuResponse;
    onDelete: (id: number) => Promise<boolean>;
}

export default function MenuCard({ menu, onDelete }: MenuCardProps) {
    const baseUrl = '/images';

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`'${menu.korName}' 메뉴를 삭제하시겠습니까?`)) {
            const success = await onDelete(menu.id);
            if (success) {
                toast.success('메뉴가 삭제되었습니다.');
            } else {
                toast.error('삭제에 실패했습니다.');
            }
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.topCurve}></div>
            
            <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                    <Link href={`/admin/menus/${menu.id}`}>
                        {menu.imageSrc && menu.imageSrc !== 'blank.png' ? (
                            <Image
                                src={`${baseUrl}/${menu.imageSrc}`}
                                alt={menu.korName}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className={styles.noImage}>No Image</div>
                        )}
                    </Link>
                    <div className={styles.badges}>
                        {menu.isSoldOut && <span className={styles.badgeSoldOut}>품절</span>}
                        {!menu.isAvailable && <span className={styles.badgeHidden}>숨김</span>}

                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <Link href={`/admin/menus/${menu.id}`} className={styles.nameLink}>
                        <h3 className={styles.name}>{menu.korName}</h3>
                    </Link>
                    <span className={styles.price}>{menu.price.toLocaleString()}원</span>
                </div>
                <p className={styles.engName}>{menu.engName}</p>

                <div className={styles.actions}>
                    <Link href={`/admin/menus/${menu.id}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={menu.isSoldOut ? styles.actionActive : ''}
                        >
                            {menu.isSoldOut ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                    </Link>
                    <Link href={`/admin/menus/${menu.id}/edit`}>
                        <Button variant="ghost" size="sm">
                            <Edit size={18} />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={handleDelete}
                    >
                        <Trash size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
