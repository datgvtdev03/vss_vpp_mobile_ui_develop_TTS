import {
  DragEvent as _DragEvent,
  SwipeDirection as _SwipeDirection,
  ModalProps as _ModalProps,
  ModalFooterProps as _ModalFooterProps,
  ModalButtonProps as _ModalButtonProps,
  ModalTitleProps as _ModalTitleProps,
  ModalContentProps as _ModalContentProps,
  BackdropProps as _BackdropProps,
} from "./type";
import ModalPortal from "./ModalPortal";
import Modal from "./Modal";
import BottomModal from "./BottomModal";
import DraggableView from "./components/DraggableView";
import Backdrop from "./components/Backdrop";
import ModalTitle from "./components/ModalTitle";
import ModalFooter from "./components/ModalFooter";
import ModalButton from "./components/ModalButton";
import ModalContent from "./components/ModalContent";
import Animation from "./animations/Animation";
import FadeAnimation from "./animations/FadeAnimation";
import ScaleAnimation from "./animations/ScaleAnimation";
import SlideAnimation from "./animations/SlideAnimation";

export {
  ModalPortal,
  Modal,
  BottomModal,
  Backdrop,
  DraggableView,
  ModalButton,
  ModalContent,
  ModalTitle,
  ModalFooter,
  Animation,
  FadeAnimation,
  ScaleAnimation,
  SlideAnimation,
};
export type DragEvent = _DragEvent;
export type SwipeDirection = _SwipeDirection;
export type ModalProps = _ModalProps;
export type ModalFooterProps = _ModalFooterProps;
export type ModalButtonProps = _ModalButtonProps;
export type ModalTitleProps = _ModalTitleProps;
export type ModalContentProps = _ModalContentProps;
export type BackdropProps = _BackdropProps;

export default Modal;
