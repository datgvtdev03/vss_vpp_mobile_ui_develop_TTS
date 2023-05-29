import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Header, HeaderProps, makeStyles } from "react-native-elements";
import navigationService from "src/navigation/navigationService";

interface IHeaderProps extends HeaderProps {
  title?: string;
  filled?: boolean;
  hideBack?: boolean;
  rightText?: boolean;
  onPressLeft?: () => void;
  onRightButton?: () => void;
  transparent?: boolean;
  renderRight?: Element;
}
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    paddingHorizontal: 16,
  },
  containerFilled: {
    backgroundColor: "#EE0033",
  },
  containerTransparent: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleFilled: {
    color: "white",
    fontWeight: "700",
  },
}));
const AppHeader = (props: IHeaderProps) => {
  const { filled, title, hideBack, transparent, onPressLeft } = props;
  const styles = useStyles();
  return (
    <View>
      <StatusBar barStyle="light-content" backgroundColor="#EE0033" />
      <Header
        {...props}
        containerStyle={[
          styles.container,
          filled ? styles.containerFilled : null,
          transparent ? styles.containerTransparent : null,
        ]}
        rightComponent={props.renderRight ? props.renderRight : undefined}
        leftComponent={
          !hideBack ? (
            <TouchableOpacity onPress={navigationService.goBack}>
              {/* <Image
                resizeMode="contain"
                source={images.ic_back_white}
                style={{
                  height: 20,
                  width: 20,
                  justifyContent: "center",
                }}
              /> */}
              <Text>ABCD</Text>
            </TouchableOpacity>
          ) : undefined
        }
        centerComponent={{
          text: title,
          style: {
            ...styles.title,
            ...(filled || transparent ? styles.titleFilled : {}),
          },
        }}
      />
    </View>
  );
};
export default AppHeader;
