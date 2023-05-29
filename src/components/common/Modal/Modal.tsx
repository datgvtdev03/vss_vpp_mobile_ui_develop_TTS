import React from "react";
import ModalPortal from "./ModalPortal";
import { ModalProps } from "./type";

export default class Modal extends React.Component<ModalProps> {
  id = null;

  componentDidMount() {
    if (!ModalPortal.ref) {
      throw new Error(
        `Can not use ${this.constructor.name} component until ModalPortal is mounted`
      );
    }
    if (this.props.visible) {
      this.show();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.show();
      } else {
        this.dismiss();
      }
    }
    //  always re-render
    if (this.id) {
      this.update();
    }
  }

  componentWillUnmount() {
    if (this.id) {
      this.dismiss();
    }
  }

  show() {
    const { children, ...options } = this.props;
    this.id = ModalPortal.show(children, options);
  }

  dismiss() {
    ModalPortal.dismiss(this.id);
    if (this.props.resetStackDismiss) {
      ModalPortal.resetStack();
    }
    this.id = null;
  }

  update() {
    const { ...props } = this.props;
    delete props.visible;
    ModalPortal.update(this.id, props);
  }

  render() {
    return null;
  }
}
