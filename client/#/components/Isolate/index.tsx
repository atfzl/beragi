import * as React from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';

interface Props {
  onReady: (document: Document, element: HTMLDivElement) => void;
}

interface State {
  refRect?: ClientRect;
}

class Isolate extends React.Component<Props, State> {
  public state: State = {};

  private window?: Window;
  private document?: Document;

  private getElementRef = (element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }

    const resizeObserver = new (this.window as any).ResizeObserver(
      (entries: any) => {
        for (const entry of entries) {
          this.setState({ refRect: entry.contentRect });
        }
      },
    );

    resizeObserver.observe(element);

    this.props.onReady(this.document!, element);

    this.document!.body.style.margin = '0';
  };

  private onFrameLoad(window: Window, document: Document) {
    this.window = window;
    this.document = document;
  }

  public render() {
    const { refRect } = this.state;

    return (
      <Frame
        style={{
          width: refRect ? refRect.width : '100%',
          height: refRect ? refRect.height : '100%',
          border: 'none',
          display: 'block',
        }}
      >
        {(() => {
          if (!this.window) {
            return (
              <FrameContextConsumer>
                {({
                  window,
                  document,
                }: {
                  window: Window;
                  document: Document;
                }) => {
                  this.onFrameLoad(window, document);
                }}
              </FrameContextConsumer>
            );
          }

          return null;
        })()}
        <div
          style={{
            display: 'inline-block',
          }}
          ref={this.getElementRef}
        />
      </Frame>
    );
  }
}

export default Isolate;