import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import useFocusError from "src/common/hooks/useFocusError";
import useKeyboardState from "src/common/hooks/useKeyboardState";
import Button from "src/components/base/Button";
import { TextInput } from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import { Text } from "src/components/base/Typography";
import InputView from "src/components/utilities/InputView";
import Svgs from "src/constants/Svgs";
import { globalData } from "src/constants/common";
import dimens from "src/constants/dimens";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { Gender } from "src/models/login";
import * as yup from "yup";
import useLogin from "./useLogin";

const Header = ({ children }: { children: React.ReactElement }) => {
  const { tw } = useTailwind();
  const { keyboardShown } = useKeyboardState();

  return (
    <>
      <StatusBar
        backgroundColor={"transparent"}
        translucent
        barStyle="light-content"
      />
      <View style={[tw("bg-white"), styles.header]}>
        <View>
          {keyboardShown ? (
            <Svgs.LoginHeader
              width={dimens.deviceWidth}
              height={dimens.deviceWidth * 0.352}
            />
          ) : (
            <View
              style={{
                backgroundColor: "#0d0c22",
                height: 400,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Image source={images.RnLogo} /> */}
              <Text style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>
                Viettel Printing & Packaging
              </Text>
            </View>
          )}
        </View>
        {children}
      </View>
    </>
  );
};

const loginSchema = yup
  .object({
    username: yup.string().required("Tên đăng nhập không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
  })
  .required();

const loginSchemaResolver = yupResolver(loginSchema);

const Form = () => {
  const { tw } = useTailwind();
  const [hidden, setHidden] = useState(true);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onSubmit",
    resolver: loginSchemaResolver,
    shouldUnregister: true,
    defaultValues: {
      username: "2705",
      password: "123456",
    },
  });

  const { handleLogin, savedLoginInfo, removeLoginInfo } = useLogin(setValue);
  useFocusError(errors, setFocus);

  return (
    <View>
      <View style={tw("bg-white", "items-center", "justify-around", "pb-10")}>
        <Text style={tw("font-semi-bold", "text-20", "text-center", "my-24")}>
          {"Đăng nhập"}
        </Text>
        {savedLoginInfo?.username && (
          <>
            <View style={tw("items-center", "flex-row")}>
              {savedLoginInfo?.gender === Gender.Male && (
                <Svgs.FemaleAvatar height={25} width={25} />
              )}
              {savedLoginInfo?.gender === Gender.Female && (
                <Svgs.MaleAvatar height={25} width={25} />
              )}
              <Text style={tw("ml-12")}>
                {"Xin chào "}
                <Text style={tw("font-bold")}>{savedLoginInfo?.name}</Text>
              </Text>
            </View>
            <View>
              <Text style={tw("my-12")}>{"Nhập mật khẩu"}</Text>
            </View>
          </>
        )}
        <TextInput
          control={control}
          name="username"
          // prependIcon={<Svgs.UserLogo />}
          style={[
            tw("mx-24"),
            Boolean(savedLoginInfo?.username) &&
              tw("h-0", "border-0", "overflow-hidden"),
          ]}
          errorStyle={tw("pl-24")}
          placeholder="Tài khoản"
          placeholderTextColor="gray"
          returnKeyType="next"
          onSubmitEditing={() => setFocus("password")}
        />
        {!savedLoginInfo?.username && <Pix size={24} />}
        <TextInput
          control={control}
          name="password"
          // prependIcon={<Svgs.PassLogo />}
          appendIcon={
            <TouchableOpacity onPress={() => setHidden(!hidden)}>
              {hidden ? (
                <Svgs.IcEyeClosed width={20} height={20} />
              ) : (
                <Svgs.IcEye width={23} height={23} />
              )}
            </TouchableOpacity>
          }
          style={tw("mx-24")}
          errorStyle={tw("pl-24")}
          placeholder="Mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry={hidden}
          maxLength={25}
          onSubmitEditing={handleSubmit(handleLogin)}
        />
        {/* TÍNH NĂNG CHƯA PHÁT TRIỂN ===>> TẠM THỜI ẨN ĐÊ */}
        {/* {!savedLoginInfo.username && (
          <TouchableOpacity style={tw("py-12")}>
            <Text style={[tw("text-12", "text-#EE0033")]}>
              {"Quên mật khẩu?"}
            </Text>
          </TouchableOpacity>
        )} */}
        {savedLoginInfo?.username && (
          <View style={tw("w-10/12")}>
            <View style={[tw("flex-row", "justify-between")]}>
              {/* TÍNH NĂNG CHƯA PHÁT TRIỂN ===>> TẠM THỜI ẨN ĐÊ */}
              {/* <TouchableOpacity style={tw("py-12")}>
                <Text style={[tw("text-12", "text-#EE0033")]}>
                  {"Quên mật khẩu?"}
                </Text>
              </TouchableOpacity> */}
              <View />
              <TouchableOpacity style={tw("py-12")} onPress={removeLoginInfo}>
                <Text style={[tw("text-12", "text-#EE0033")]}>
                  {"Đổi tài khoản"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Button
        style={tw("self-stretch", "mx-16", "mt-8")}
        color="#EE0033"
        rounded
        onPress={handleSubmit(handleLogin)}
        children={"ĐĂNG NHẬP"}
      />
    </View>
  );
};

const Login = (): React.ReactElement => {
  const { tw } = useTailwind();
  return (
    <View style={tw("flex-1", "bg-white")}>
      <InputView>
        <Header>
          <Form />
        </Header>
      </InputView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  header: {
    marginTop: -45,
  },
});
