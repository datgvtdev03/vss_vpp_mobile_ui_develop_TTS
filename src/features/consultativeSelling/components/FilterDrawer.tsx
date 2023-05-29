import React, { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import { Text } from "src/components/base/Typography";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import dimens from "src/constants/dimens";
import { TextInput } from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import Button from "src/components/base/Button";

type FilterList = { filterList: { title: string; list: string[] }[] };

const Drawer = createDrawerNavigator();
const DrawerContent = ({
  filterList,
  ...props
}: FilterList & DrawerContentComponentProps) => {
  const { tw } = useTailwind();

  return (
    <>
      <View
        style={[
          tw("bg-white"),
          {
            height:
              dimens.deviceHeight +
              (Platform.OS === "android" ? dimens.statusBarHeight : 0),
          },
        ]}
      >
        <View
          style={[
            tw(
              "flex-row",
              "justify-center",
              "pb-16",
              "border-b",
              "border-#AAAAAA"
            ),
            { paddingTop: dimens.statusBarHeight + 24 },
          ]}
        >
          <Text style={tw("font-bold", "text-center", "text-16")}>
            Bộ lọc sản phẩm
          </Text>
          <Svgs.Reload style={tw("absolute", "right-16", "bottom-16")} />
        </View>
        <DrawerContentScrollView
          showsVerticalScrollIndicator={false}
          {...props}
        >
          <View style={[tw("mx-16"), { marginTop: -dimens.statusBarHeight }]}>
            <TextInput
              name="search"
              placeholder="Từ khoá cần lọc"
              rounded
              style={tw("border-0", "flex-1", "mb-8", "shadow-2", "mt-16")}
              prependIcon={
                <Svgs.Filter fill="#AAAAAA" height={20} width={20} />
              }
            />
            {filterList.map((filter, idx) => (
              <View style={tw("mt-8")} key={idx}>
                <Text style={tw("mb-16")}>{filter.title}</Text>
                {filter.list
                  .reduce<string[][]>((all, one, i) => {
                    const ch = Math.floor(i / 2);
                    all[ch] = ([] as string[]).concat(all[ch] || [], one);
                    return all;
                  }, [])
                  .map((chunkItem) => (
                    <View key={chunkItem[0]} style={tw("flex-row", "mb-16")}>
                      <Button
                        color="rgba(170, 170, 170, 0.24)"
                        style={tw("flex-1", "mr-20")}
                        children={
                          <Text style={tw("text-12", "text-#707070")}>
                            {chunkItem[0]}
                          </Text>
                        }
                      />
                      {chunkItem[1] ? (
                        <Button
                          color="rgba(170, 170, 170, 0.24)"
                          style={tw("flex-1")}
                          children={
                            <Text style={tw("text-12", "text-#707070")}>
                              {chunkItem[1]}
                            </Text>
                          }
                        />
                      ) : (
                        <View style={tw("flex-1")} />
                      )}
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </DrawerContentScrollView>
        <View
          style={tw(
            "flex-row",
            "border-t",
            "border-#AAAAAA",
            "py-12",
            "mb-16",
            "justify-center"
          )}
        >
          <Button
            outlined
            rounded
            style={tw("flex-1", "mx-8")}
            color="#EE0033"
            children="Bỏ qua"
          />
          <Pix size={12} />
          <Button
            rounded
            style={tw("flex-1", "mx-8")}
            color="#EE0033"
            children="Áp dụng"
          />
        </View>
      </View>
    </>
  );
};

const StatusBarHandler = ({
  children,
  ...props
}: {
  children: React.ReactElement;
}) => {
  const drawerStatus = useDrawerStatus();
  useEffect(() => {
    if (drawerStatus === "open") {
      StatusBar.setBarStyle("dark-content");
    } else {
      StatusBar.setBarStyle("light-content");
    }
  }, [drawerStatus]);

  return <>{React.cloneElement(children, { ...props, ...children.props })}</>;
};

const FilterDrawer = ({
  children,
  filterList,
}: FilterList & {
  children: React.ReactElement;
}) => {
  const { tw } = useTailwind();

  return (
    <Drawer.Navigator
      initialRouteName="Filter"
      screenOptions={{
        drawerPosition: "right",
        drawerType: "front",
        drawerActiveBackgroundColor: "transparent",
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "white",
        overlayColor: "rgba(0,0,0, 0.16)",
        drawerStyle: tw("flex-1", "bg-transparent", "w-11/12"),
        sceneContainerStyle: tw("bg-transparent"),
        headerShown: false,
      }}
      drawerContent={(props: DrawerContentComponentProps) => {
        return <DrawerContent filterList={filterList} {...props} />;
      }}
    >
      <Drawer.Screen name="Filter">
        {(props) => <StatusBarHandler {...props} children={children} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default FilterDrawer;
