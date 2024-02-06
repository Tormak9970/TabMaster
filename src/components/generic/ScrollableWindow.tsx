import { GamepadButton, gamepadDialogClasses, scrollPanelClasses, ModalPosition, ScrollPanelGroup, Focusable } from 'decky-frontend-lib';
import { FC, Fragment, useRef } from 'react';
import { useIsOverflowing } from '../../hooks/useIsOverflowing';

export interface ScrollableWindowProps {
  height: string;
  fadeAmount: string;
  scrollBarWidth?: string;
}
export const ScrollableWindow: FC<ScrollableWindowProps> = ({ height, fadeAmount, scrollBarWidth, children }) => {
  const barWidth = scrollBarWidth === undefined || scrollBarWidth === '' ? '4px' : scrollBarWidth;

  const scrollPanelRef = useRef();
  const isOverflowing = useIsOverflowing(scrollPanelRef);

  const panel = (
    <ScrollPanelGroup
      //@ts-ignore
      ref={scrollPanelRef}
      focusable={false}
      style={{ flex: 1, minHeight: 0 }}
    >
      <Focusable
        noFocusRing={true}
        actionDescriptionMap={{
          [GamepadButton.DIR_UP]: 'Scroll Up',
          [GamepadButton.DIR_DOWN]: 'Scroll Down'
        }}
        //@ts-ignore
        focusable={isOverflowing}
      >
        {children}
      </Focusable>
    </ScrollPanelGroup>
  );

  return (
    <>
      <style>
        {`.modal-position-container .${gamepadDialogClasses.ModalPosition} {
          top: 0;
          bottom: 0;
          padding: 0;
        }
        .modal-position-container .${scrollPanelClasses.ScrollPanel}::-webkit-scrollbar {
          display: initial !important;
          width: ${barWidth};
        }
        .modal-position-container .${scrollPanelClasses.ScrollPanel}::-webkit-scrollbar-thumb {
          border: 0;
        }`}
      </style>
      <div
        className='modal-position-container'
        style={{
          position: 'relative',
          height: height,
          WebkitMask: `linear-gradient(to right , transparent, transparent calc(100% - ${barWidth}), white calc(100% - ${barWidth})), linear-gradient(to bottom, transparent, black ${fadeAmount}, black calc(100% - ${fadeAmount}), transparent 100%)`
        }}>
        {isOverflowing ? (
          <ModalPosition key={'modal-position'}>
            {panel}
          </ModalPosition>
        ) : (
          <div className={`${gamepadDialogClasses.ModalPosition} ${gamepadDialogClasses.WithStandardPadding} Panel`} key={'modal-position'}>
            {panel}
          </div>
        )}
      </div>
    </>
  );
};
