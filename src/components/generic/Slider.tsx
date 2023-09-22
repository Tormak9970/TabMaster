import { SliderField, SliderFieldProps, gamepadDialogClasses } from 'decky-frontend-lib';
import { VFC } from 'react';

export interface SliderProps extends Omit<SliderFieldProps, 'label' | 'description' | 'layout' | 'icon' | 'bottomSeparator' | 'indentLevel' | 'tooltip' | 'showValue' | 'editableValue' | 'valueSuffix'> { }

const highlightColor = '#bbc1c94a';

const sliderStyle = `
  .slider-container.highlight-slider .${gamepadDialogClasses.Field}.gpfocuswithin .gamepadslider_SliderControl_3o137{
    background-color: ${highlightColor};
    box-shadow: 0px 0px 8px 8px ${highlightColor};
    border-radius: 10px;
  }

  .slider-container .${gamepadDialogClasses.Field} {
    padding: 0;
    flex: auto;
    --field-negative-horizontal-margin: 0
  }

  .slider-container .gamepadslider_SliderControl_3o137 {
    transition-property: background-color, box-shadow;
    transition-duration: .20s;
    height: 6px;
  }

  .slider-container .gamepadslider_SliderHandle_2yVKj {
    top: -8px;
  }

  .slider-container .gamepadslider_SliderNotchTick_Fv1Ht {
    height: 4px;
  }

  .slider-container .gamepadslider_SliderNotchContainer_2N-a5 {
    margin-top: 4px;
  }
`;

export const Slider: VFC<SliderProps> = ({ highlightOnFocus, ...props }) => {
  return (
    <div
      className={`slider-container${(highlightOnFocus ?? true) ? ' highlight-slider' : ''}`}
      style={{ minHeight: '40px', display: 'flex', alignItems: 'center', flex: 'auto' }}
    >
      <style>{sliderStyle}</style>
      <SliderField {...props} highlightOnFocus={false} />
    </div>
  );
};
