import React from "react";
import BaseModal from "./components/BaseModal";
import BottomModal from "./components/BottomModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ModalPortal extends React.Component<any, { stack: any[] }> {
  id: number;
  static modals: ModalPortal[] = [];
  constructor(props) {
    super(props);
    this.state = { stack: [] as any[] }; // eslint-disable-line @typescript-eslint/no-explicit-any
    this.id = ModalPortal.modals.length;
    ModalPortal.modals.push(this);
  }

  static get ref() {
    return ModalPortal.modals.slice(-1)[0];
  }

  static get size() {
    return ModalPortal.modals.slice(-1)[0].state.stack.length;
  }

  static resetStack = () => {
    if (ModalPortal.modals.slice(-1)[0]) {
      ModalPortal.modals.slice(-1)[0].setState(() => {
        return { stack: [] };
      });
    }
  };

  static show(children, props = {}) {
    return ModalPortal.modals.slice(-1)[0].show({ children, ...props });
  }

  static update(key, props) {
    ModalPortal.modals.slice(-1)[0].update(key, props);
  }

  static dismiss(key) {
    ModalPortal.modals.slice(-1)[0].dismiss(key);
  }

  static dismissAll() {
    ModalPortal.modals.slice(-1)[0].dismissAll();
  }

  get current() {
    if (this.state.stack.length) {
      return this.state.stack[this.state.stack.length - 1].key;
    }
  }

  componentWillUnmount() {
    ModalPortal.modals.splice(ModalPortal.modals.length - 1, 1);
  }

  generateKey = () => `modal-${this.id++}`;

  getIndex = (key) => this.state.stack.findIndex((i) => i.key === key);

  getProps = (props) => {
    const key = props.key || this.generateKey();
    return { visible: true, ...props, key };
  };

  show = (props) => {
    const mergedProps = this.getProps(props);
    this.setState(({ stack }) => {
      return { stack: stack.concat(mergedProps) };
    });
    return mergedProps.key;
  };

  update = (key, props) => {
    const mergedProps = this.getProps({ ...props, key });
    this.setState(({ stack }) => {
      const index = this.getIndex(key);
      stack[index] = { ...stack[index], ...mergedProps };
      return { stack };
    });
  };

  dismiss = (key = this.current) => {
    if (!key) return;
    const props = { ...this.state.stack[this.getIndex(key)], visible: false };
    this.update(key, props);
  };

  dismissAll = () => this.state.stack.forEach(({ key }) => this.dismiss(key));

  dismissHandler = (key) => {
    // dismiss handler: which will remove data from stack and call onDismissed callback
    const { onDismiss = () => null } = this.state.stack[this.getIndex(key)];
    this.setState(({ stack }) => {
      return { stack: stack.filter((i) => i.key !== key) };
    }, onDismiss);
  };

  renderModal = ({ type = "modal", ...props }) => {
    if (type === "modal") {
      return (
        <BaseModal
          {...props}
          onDismiss={() => this.dismissHandler(props.key)}
        />
      );
    } else if (type === "bottomModal") {
      return (
        <BottomModal
          {...props}
          onDismiss={() => this.dismissHandler(props.key)}
        />
      );
    }
  };

  render() {
    return this.state.stack.map(this.renderModal);
  }
}

export default ModalPortal;
