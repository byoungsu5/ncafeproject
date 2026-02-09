import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classNames} {...props}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
        </button>
    );
}
