import React from 'react';
import {DraggableCore} from 'react-draggable';
import Measure from 'react-measure';
import classNames from 'classnames';

import styles from './ProgressIndicators.module.css';

export class ProgressIndicators extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progressBarsContainerWidth: null
    };

    this.measureProgressIndicatorsContainer = (width) => {
      this.setState({progressBarsContainerWidth: width});
    };

    this.handleStop = (mouseEvent, dragEvent) => {
      props.seekTo(this.positionToTime(dragEvent.x));
    };

    this.handleDrag = (mouseEvent, dragEvent) => {
      props.scrubTo(this.positionToTime(dragEvent.x));
    };
  }

  loadProgress() {
    return this.props.duration > 0 ? (this.props.bufferedEnd / this.props.duration) : 0;
  }

  playProgress() {
    return this.props.duration > 0 ? (this.props.currentTime / this.props.duration) : 0;
  }

  handlePosition() {
    if (this.state.progressBarsContainerWidth) {
      return ((this.state.progressBarsContainerWidth) * this.playProgress());
    } else {
      return toPercent(this.playProgress());
    }
  }

  positionToTime(x) {
    if (this.props.duration && this.state.progressBarsContainerWidth) {
      const fraction = Math.max(0, Math.min(1, x / this.state.progressBarsContainerWidth));
      return fraction * this.props.duration;
    } else {
      return 0;
    }
  }

  render() {
    return (
      <div className={classNames(styles.progressIndicatorsContainer)}>
        <Measure client
                 onResize={contentRect => {
                   this.measureProgressIndicatorsContainer(contentRect.client.width)
                 }}>
          {({measureRef}) =>
            <DraggableCore onStart={this.handleDrag}
                           onDrag={this.handleDrag}
                           onStop={this.handleStop}>
              <div ref={measureRef} className={classNames(styles.progressBarsContainer)}>
                <div className={classNames(styles.progressBar, styles.loadingProgressBar)}
                     style={{width: toPercent(this.loadProgress())}}
                     data-testid="loading-progress-bar"/>
                <div className={classNames(styles.progressBar, styles.playProgressBar)}
                     style={{width: toPercent(this.playProgress())}}
                     data-testid="play-progress-bar"/>
                <div className={classNames(styles.sliderHandle)}
                     style={{left: this.handlePosition()}}
                     data-testid="slider-handle"/>
              </div>
            </DraggableCore>
          }
        </Measure>
      </div>
    );
  }
}

function toPercent(value) {
  return value > 0 ? (value * 100) + '%' : 0;
}