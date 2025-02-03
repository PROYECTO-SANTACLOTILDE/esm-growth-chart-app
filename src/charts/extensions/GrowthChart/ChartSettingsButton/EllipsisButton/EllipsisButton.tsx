import React, { useState, useRef, type ReactNode } from 'react';
import { Button, OverflowMenu, OverflowMenuItem, Layer } from '@carbon/react';
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
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <Button
        ref={buttonRef}
        kind={kind}
        size={size}
        data-testid={dataTest}
        onClick={toggleMenu}
        renderIcon={OverflowMenuVertical}
        iconDescription={iconDescription}
        hasIconOnly
      />
      {isOpen && (
        <Layer>
          <OverflowMenu
            open={isOpen}
            onClose={closeMenu}
            aria-label="Additional options"
            menuOptionsClass="custom-overflow-menu"
            selectorPrimaryFocus={buttonRef.current || undefined}
          >
            {children}
          </OverflowMenu>
        </Layer>
      )}
    </>
  );
};
