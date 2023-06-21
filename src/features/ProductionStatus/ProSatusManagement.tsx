import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {BottomTabNavigationOptions } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import { View,Text,TouchableOpacity, Alert } from "react-native";
import { PickerInputWithLabel, TextInput } from "src/components/base/Input";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind"
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import React,{useCallback, useEffect, useState,useMemo} from "react";
import Pix from "src/components/base/Pix";
import DialogAlert from "src/components/common/DialogAlert";
import { DatePickerButtonWithLabel } from "src/components/common/DatePickerButton";
import EmptyComponent from "../statistic/components/EmptyComponent";
import { Badge, Button } from "react-native-elements";
import { RadioGroupWithLabel } from "src/components/base/RadioButton";
import { RadioButtonGroup } from "src/components/base/RadioButton";
import { RadioButtonItem } from "src/components/base/RadioButton";
import { StatisticApi } from "../statistic/api/StatisticApi";
import { isHasLength } from "src/utils/helpers";
import { Reason } from "../statistic/models/consumableMaterials";
import { ActionId } from "../statistic/constants";
import dayjs from "dayjs"
import { TinhTrangHoatDongList } from "../statistic/models/productionSituation";
import { useIsFocused } from "@react-navigation/core";
const tab= createBottomTabNavigator();
const customTabBarStyle :BottomTabNavigationOptions ={
    tabBarActiveTintColor: "#EE0033",
    tabBarInactiveTintColor: "gray",
    tabBarStyle: { backgroundColor: "white" },
    headerShown: false,
}
const ProSatusManagement =()=>{
    //
const [keyword,setKeyword] = useState("");
const [fromDate,setFromDate] = useState(dayjs().subtract(7))
const [toDate,setToDate] = useState(new Date())
const [list ,setList]  = useState<TinhTrangHoatDongList[]>([])
const [loadRefresh,setLoadRefresh] =useState(true)
//
  // Các state và hooks khác đã được bỏ qua để tập trung vào phần lấy dữ liệu từ API
  
  const [list1, setList2] = useState<TinhTrangHoatDongList[]>([]);



  // Các thành phần và mã nguồn khác



const SearchProStatus = useCallback(async()=>{
  const body = {
    fromDate:
     dayjs(fromDate).format("YYYY-MM-DD"),
    toDate:
    dayjs(toDate).format("YYYY-MM-DD"),
    keyword:keyword,
  };
  const res = await StatisticApi.postSearchProductionSituations(body).run();
//  Alert.alert(JSON.stringify(res)) 
  isHasLength(res) ? setList(res) :setList
},[fromDate,toDate,keyword])
const isErrorDate = useMemo(()=>{
  const diff = dayjs(dayjs(fromDate).format("YYYY-MM-DD")).diff(
    dayjs(dayjs(toDate).format("YYYY-MM-DD"))
  )
  return diff > 0 ?  true :false
},[fromDate,toDate])
const isFocused = useIsFocused()
useEffect(()=>{
  if(isErrorDate){
    return;
  }else{
    if(isFocused===true){
      SearchProStatus()
    }
  }
}, [SearchProStatus,isErrorDate,isFocused])


//________________________________________________________________________________________________

//__________________________________________________________________________________________________ 



    const {tw} =useTailwind();
    return (
        <View style={tw("flex-1")}>
       <DefaultActionBar
       title="Danh sách tình trạng sản xuất"
       onPressLeft={()=>{
        navigationService.backToScreen(navigationRoutes.MAIN)
       }}
       />
       <View  style={tw("py-8")}>
        <View 
        style={tw("px-16")}
        >
        <TextInput
       name ="search" 
      placeholder="Ca, người nhập"
       rounded
      prependIcon={
        <Svgs.SearchIcon fill={"#AAAAAA"} width={15} height={15}/>
        
      }
      defaultValue={keyword}
      onEndEditing={(event) => setKeyword(event.nativeEvent.text)}
      isClearText
      onClearText={()=>setKeyword("")}
    />
        </View>
        <Pix size={8}/>
        <View
        style={tw('flex-row','px-16')}>
          <View style={tw("flex-1","pr-8")}>
          <DatePickerButtonWithLabel
              label="Từ ngày"
              value={fromDate}
              maxDate={new Date()}
              error={isErrorDate ? "Từ ngày không được lớn hơn đến ngày " : ""}
              onChange={(fromDate) => setFromDate(fromDate)}
            />
            </View>  
            <View style={tw("flex-1","pl-8")}>
            <DatePickerButtonWithLabel
              label="Đến ngày"
              value={toDate}
              maxDate={new Date()}
              onChange={(toDate) => setToDate(toDate)}
            />
            </View>
        </View>

        <Pix size={8}/>
        <View style={tw("flex-row")}>
       <View style={tw("flex-1","py-8","px-16")}>
          <Text>Danh sach: Null</Text>
       </View>
    
        </View>
       </View>

       {/* render */}
       <View style={[tw("flex-1")]}>
       {/* flatList */}
       <EmptyComponent
       text={`Hiện tại chưa có bản Tình trạng  nào! \n Vui lòng kéo xuống để tải lại!`}
       />
       </View>
      
<TouchableOpacity
        style={tw("absolute", "right-10", "bottom-50", "z-50")}
           onPress={()=>navigationService.navigate(navigationRoutes.PRODUCTION_SITUATION)}
       >
        <Svgs.AddManagement />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw("absolute", "left-10", "bottom-50", "z-50")}
            onPress={()=>navigationService.navigate(navigationRoutes.ADD_PROSTATUS)}
   
       >
        <Svgs.AlertError />
      </TouchableOpacity>

      {/*  */}
      <Button
      onPress={()=>{
    //   Alert.alert(JSON.stringify(list))
      }}
      ></Button>
        </View>
    )
}
export default ProSatusManagement;
