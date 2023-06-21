import { configureStore } from "@reduxjs/toolkit";
import ProSatusSlice from "./ProSatusSlice";

export default configureStore({
    reducer:{
        proStatus:ProSatusSlice,
    }
})