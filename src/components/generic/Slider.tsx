import { SliderField, SliderFieldProps, gamepadDialogClasses, gamepadSliderClasses } from 'decky-frontend-lib';
import { VFC } from 'react';

export interface SliderProps extends Omit<SliderFieldProps, 'label' | 'description' | 'layout' | 'icon' | 'bottomSeparator' | 'indentLevel' | 'tooltip' | 'showValue' | 'editableValue' | 'valueSuffix'> { }

const highlightColor = '#bbc1c94a';

const sliderStyle = `
  .slider-container.highlight-slider .${gamepadDialogClasses.Field}.gpfocuswithin .${gamepadSliderClasses.SliderControl} {
    background-color: ${highlightColor};
    box-shadow: 0px 0px 8px 8px ${highlightColor};
    border-radius: 10px;
  }

  .slider-container .${gamepadDialogClasses.Field} {
    padding: 0;
    flex: auto;
    --field-negative-horizontal-margin: 0
  }

  .slider-container .${gamepadSliderClasses.SliderControl} {
    transition-property: background-color, box-shadow;
    transition-duration: .20s;
    height: 6px;
  }

  .slider-container .${gamepadSliderClasses.SliderHandle} {
    top: -8px;
  }

  .slider-container .${gamepadSliderClasses.SliderNotchTick} {
    height: 4px;
  }

  .slider-container .${gamepadSliderClasses.SliderNotchContainer} {
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
