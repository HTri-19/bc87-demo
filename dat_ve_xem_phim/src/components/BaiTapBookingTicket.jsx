import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { datGhe, datVe, huyGhe } from '../redux/bookingSlice';

const BaiTapBookingTicket = () => {
  const { danhSachGhe, danhSachGheDangChon, tongTien } = useSelector(state => state.booking);
  const dispatch = useDispatch();

  const handleChonGhe = (soGhe) => {
    dispatch(datGhe({ soGhe }));
  };

  const handleDatVe = () => {
    if (danhSachGheDangChon.length > 0) {
      dispatch(datVe());
      alert(`Đặt vé thành công! Tổng tiền: ${tongTien.toLocaleString()} VNĐ`);
    }
  };

  const handleHuyGhe = () => {
    dispatch(huyGhe());
  };

  const renderGhe = (ghe) => {
    let cssClass = 'ghe';
    
    if (ghe.daDat) {
      cssClass = 'gheDuocChon';
    } else if (danhSachGheDangChon.find(g => g.soGhe === ghe.soGhe)) {
      cssClass = 'gheDangChon';
    }

    return (
      <button
        key={ghe.soGhe}
        className={cssClass}
        onClick={() => handleChonGhe(ghe.soGhe)}
        disabled={ghe.daDat}
      >
        {ghe.soGhe}
      </button>
    );
  };

  const renderHangGhe = (hangGhe, index) => {
    if (hangGhe.hang === '') {
      // Hàng số (màn hình)
      return (
        <div key={index} className="row">
          {hangGhe.danhSachGhe.map(ghe => (
            <button key={ghe.soGhe} className="rowNumber">
              {ghe.soGhe}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div key={index} className="row">
        <span className="firstChar">{hangGhe.hang}</span>
        {hangGhe.danhSachGhe.map(ghe => renderGhe(ghe))}
      </div>
    );
  };

  return (
    <div className="bookingMovie">
      <div className="container-fluid" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row">
          <div className="col-8">
            <div className="cinema-header">
              <h1 className="cinema-title">CYBERLEARN CINEMA</h1>
              <p className="cinema-subtitle">Trải nghiệm điện ảnh đỉnh cao</p>
            </div>
            
            {/* Màn hình */}
            <div className="text-center mb-4">
              <div className="screen mx-auto">
                <span>Màn Hình</span>
              </div>
            </div>

            {/* Sơ đồ ghế */}
            <div className="text-center">
              {danhSachGhe.map((hangGhe, index) => renderHangGhe(hangGhe, index))}
            </div>
          </div>

          <div className="col-4">
            <div className="booking-panel">
              <div className="panel-header">
                <h3>THÔNG TIN ĐẶT VÉ</h3>
              </div>
              
              <div className="booking-summary">
                <div className="summary-header">
                  <div className="col-header">Ghế</div>
                  <div className="col-header">Giá</div>
                </div>
                
                {danhSachGheDangChon.length === 0 ? (
                  <div className="empty-selection">
                    <span>Chưa chọn ghế nào</span>
                  </div>
                ) : (
                  danhSachGheDangChon.map(ghe => (
                    <div key={ghe.soGhe} className="seat-item">
                      <div className="seat-number">{ghe.soGhe}</div>
                      <div className="seat-price">{ghe.gia.toLocaleString()} VNĐ</div>
                    </div>
                  ))
                )}
                
                <div className="total-section">
                  <div className="total-label">Tổng tiền</div>
                  <div className="total-amount">
                    {tongTien.toLocaleString()} VNĐ
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn-book"
                  onClick={handleDatVe}
                  disabled={danhSachGheDangChon.length === 0}
                >
                  ĐẶT VÉ
                </button>
                <button 
                  className="btn-cancel"
                  onClick={handleHuyGhe}
                  disabled={danhSachGheDangChon.length === 0}
                >
                  HỦY GHẾ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaiTapBookingTicket;
