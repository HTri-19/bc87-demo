import { createSlice } from '@reduxjs/toolkit';
import danhSachGheData from '../services/data.json';

const initialState = {
  danhSachGhe: danhSachGheData,
  danhSachGheDangChon: [],
  tongTien: 0
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    datGhe: (state, action) => {
      const { soGhe } = action.payload;
      
      // Tìm ghế trong danh sách ghế
      let gheCanDat = null;
      for (let hangGhe of state.danhSachGhe) {
        gheCanDat = hangGhe.danhSachGhe.find(ghe => ghe.soGhe === soGhe);
        if (gheCanDat) break;
      }
      
      if (gheCanDat && !gheCanDat.daDat) {
        // Kiểm tra ghế đã được chọn chưa
        const index = state.danhSachGheDangChon.findIndex(ghe => ghe.soGhe === soGhe);
        
        if (index !== -1) {
          // Bỏ chọn ghế
          state.danhSachGheDangChon.splice(index, 1);
          state.tongTien -= gheCanDat.gia;
        } else {
          // Chọn ghế
          state.danhSachGheDangChon.push({
            soGhe: gheCanDat.soGhe,
            gia: gheCanDat.gia
          });
          state.tongTien += gheCanDat.gia;
        }
      }
    },
    
    datVe: (state) => {
      // Cập nhật trạng thái ghế đã đặt
      state.danhSachGheDangChon.forEach(gheChon => {
        for (let hangGhe of state.danhSachGhe) {
          const ghe = hangGhe.danhSachGhe.find(g => g.soGhe === gheChon.soGhe);
          if (ghe) {
            ghe.daDat = true;
            break;
          }
        }
      });
      
      // Reset danh sách ghế đang chọn
      state.danhSachGheDangChon = [];
      state.tongTien = 0;
    },
    
    huyGhe: (state) => {
      state.danhSachGheDangChon = [];
      state.tongTien = 0;
    }
  }
});

export const { datGhe, datVe, huyGhe } = bookingSlice.actions;
export default bookingSlice.reducer;
