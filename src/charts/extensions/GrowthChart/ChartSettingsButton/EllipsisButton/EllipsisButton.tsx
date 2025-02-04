import React, { type ReactNode } from 'react';
import { OverflowMenu } from '@carbon/react';
import { OverflowMenuVertical } from '@carbon/react/icons';

type Props = {
  kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  dataTest?: string;
  children: ReactNode;
  iconDescription?: string;
};

export const EllipsisButton = ({
  kind = 'ghost',
  size = 'md',
  dataTest,
  children,
  iconDescription = 'More options',
}: Props) => {
  return (
    <OverflowMenu
      data-testid={dataTest}
      kind={kind}
      size={size}
      iconDescription={iconDescription}
      ariaLabel={iconDescription}
      renderIcon={OverflowMenuVertical}
      align="end" // <-- menú alineado a la derecha
      direction="bottom" // <-- menú se despliega hacia abajo
    >
      {children}
    </OverflowMenu>
  );
};
