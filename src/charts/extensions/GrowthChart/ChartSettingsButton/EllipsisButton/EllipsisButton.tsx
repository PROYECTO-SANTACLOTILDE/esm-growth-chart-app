import React, { useState, useRef, type ReactNode } from 'react';
import { Button, OverflowMenu, OverflowMenuItem, Layer } from '@carbon/react';
import { OverflowMenuVertical } from '@carbon/react/icons';

type Props = {
  primary?: boolean;
  secondary?: boolean;
  dataTest?: string;
  small?: boolean;
  large?: boolean;
  children: ReactNode;
};

export const EllipsisButton = ({ primary, secondary, small, large, dataTest, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        kind={primary ? 'primary' : secondary ? 'secondary' : 'tertiary'}
        size={small ? 'sm' : large ? 'lg' : 'md'}
        data-testid={dataTest}
        onClick={toggleMenu}
        renderIcon={OverflowMenuVertical}
        iconDescription="Más opciones"
      />
      {isOpen && (
        <Layer>
          <OverflowMenu
            open={isOpen}
            onClose={closeMenu}
            aria-label="Opciones adicionales"
            menuOptionsClass="custom-overflow-menu"
            selectorPrimaryFocus={buttonRef.current || undefined}
          >
            {React.Children.map(children, (child, index) => (
              <OverflowMenuItem key={index} itemText={child?.toString() || ''} />
            ))}
          </OverflowMenu>
        </Layer>
      )}
    </>
  );
};
