import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import codePush, {
  CodePushOptions,
  DownloadProgress,
} from "react-native-code-push";
import defaultStyles from "./common/styles";
import colors from "./constants/colors";

interface CodePush {
  status: null | codePush.SyncStatus;
  progress: null | number;
}

const codePushOptions: CodePushOptions = {
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  rollbackRetryOptions: {
    maxRetryAttempts: 10,
    delayInHours: 12,
  },
};

const UpdateDialog = ({ status, progress }: CodePush) => (
  <View
    style={[
      defaultStyles.abs,
      defaultStyles.left,
      defaultStyles.right,
      defaultStyles.bottom,
    ]}
  >
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={
        status === codePush.SyncStatus.DOWNLOADING_PACKAGE ||
        status === codePush.SyncStatus.INSTALLING_UPDATE
      }
    >
      <View style={styles.main}>
        <View style={styles.content}>
          <View
            style={[
              defaultStyles.mt_2,
              defaultStyles.mb_1,
              defaultStyles.row,
              defaultStyles.justifyBetween,
              defaultStyles.selfStretch,
            ]}
          >
            <Text style={styles.text}>
              {status === codePush.SyncStatus.DOWNLOADING_PACKAGE &&
                "Đang tải bản cập nhật"}
              {status === codePush.SyncStatus.INSTALLING_UPDATE &&
                "Đang cài bản cập nhật"}
            </Text>
            <Text style={styles.text}>{(progress || 0) + "%"}</Text>
          </View>
          <View style={[styles.progress, { width: (progress || 0) + "%" }]} />
        </View>
      </View>
    </Modal>
  </View>
);

const CodePushContainer = codePush(codePushOptions)(
  class extends React.Component<Record<string, never>, CodePush> {
    state = {
      status: null,
      progress: null,
    };

    codePushStatusDidChange(status: codePush.SyncStatus) {
      this.setState({ status });
    }

    codePushDownloadDidProgress(progress: DownloadProgress) {
      this.setState({
        progress: Math.round(
          (progress.receivedBytes / progress.totalBytes) * 100
        ),
      });
    }

    render() {
      return (
        <>
          <UpdateDialog
            progress={this.state.progress}
            status={this.state.status}
          />
          {this.props.children}
        </>
      );
    }
  }
);

export default CodePushContainer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  content: {
    width: "80%",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    zIndex: 2,
    paddingHorizontal: 16,
  },
  progress: {
    height: 3,
    backgroundColor: colors.color_EE0033,
    marginBottom: 24,
  },
  text: {
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
});
