import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "react-native-fs";
import { StatisticApi } from "src/features/statistic/api/StatisticApi";
import { ActionId } from "src/features/statistic/constants";
import { ProductionSituation } from "src/features/statistic/models/productionSituation";
import { isHasLength } from "src/utils/helpers";

const idNhapThongKe = 79;

interface ProStatus_State {
  proStatusList: ProductionSituation[];
}

const initialState: ProStatus_State = {
  proStatusList: [],
};
const proStatusSlice = createSlice({
  name: "proStatus",
  initialState,
  reducers: {
    setProStatus: (state, action: PayloadAction<ProductionSituation[]>) => {
      if(state.proStatusList.length===0){
        state.proStatusList = action.payload;
      }

    }
    ,
    reset_ProStatus :(state)=>{
   state.proStatusList= []
    }
    ,
    add_ProSatus:(state,action)=>{
//      action.payload.id= idNhapThongKe, 
      state.proStatusList.push(action.payload)
    },
    del_ProStatus:(state,action) =>{
     // console.log(action.payload)
      const index = state.proStatusList.findIndex((pStatus) => pStatus.id === action.payload);
      if (index !== -1) {
        state.proStatusList.splice(index, 1);
       // console.log(state.proStatusList.length)
    }
  },
  Update_ProStatus:(state,action)=>{
  
    const index = state.proStatusList.findIndex((vt)=>
    vt.id ===action.payload.id)
   
   if(index!==-1){
     state.proStatusList[index]= action.payload;
  
    }   
 
 },
}
});

export const { setProStatus,reset_ProStatus ,add_ProSatus,del_ProStatus,Update_ProStatus} = proStatusSlice.actions;
export default proStatusSlice.reducer;
