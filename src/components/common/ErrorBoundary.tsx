import React from "react";
import { DevSettings } from "react-native";

export default class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  componentDidCatch(): void {
    DevSettings.reload("error");
  }
  static getDerivedStateFromError(): void {
    DevSettings.reload("error");
  }

  render(): React.ReactNode {
    return this.props.children;
  }
}
