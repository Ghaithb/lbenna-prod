import { Card as AntdCard, CardProps as AntdCardProps } from 'antd';

const AntCard: any = AntdCard;

interface CustomCardProps extends AntdCardProps {
  noPadding?: boolean;
  transparent?: boolean;
}

export function Card({ children, className = '', noPadding = false, transparent = false, ...props }: CustomCardProps) {
  return (
    <AntCard
      variant="borderless"
      className={`shadow-sm rounded-xl overflow-hidden ${className}`}
      styles={{
        body: {
          padding: noPadding ? 0 : 24,
          backgroundColor: transparent ? 'transparent' : undefined
        }
      }}
      style={{
        backgroundColor: transparent ? 'transparent' : undefined,
        boxShadow: transparent ? 'none' : undefined,
        ...props.style
      }}
      {...props}
    >
      {children}
    </AntCard>
  );
}