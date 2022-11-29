import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Search.scss';

const Search = () => {
  const [data, setData] = useState();

  const getdata = params => {
    axios
      .get(`http://localhost:4000/sick?q=${params}`)
      .then(respon => {
        stringBold(respon, params);
        console.info('calling api');
      })
      .catch(() => {
        console.log('fail');
      });
  };

  const stringBold = (respon, params) => {
    let newData = [];
    let responData = respon.data;

    responData.forEach(function (item) {
      let regex = new RegExp(params, 'gi');
      let result = item.sickNm.replace(
        regex,
        '<strong>' + params + '</strong>'
      );

      newData.push({
        sickNm: result,
      });
    });
    setData(newData);
  };

  const change = e => {
    if (e.target.value.length > 0) {
      getdata(e.target.value);
    } else {
      setData(null);
    }
  };

  return (
    <div className="searchWrap">
      <div className="searchBox">
        <div className="title">
          국내 모든 임상시험 검색하고 <br />
          온라인으로 참여하기
        </div>
        <div className="inputWrap">
          <input
            className="inputBox"
            placeholder="질환명을 입력해주세요"
            onChange={change}
          />
          <FontAwesomeIcon className="iconStyle" icon={faMagnifyingGlass} />
        </div>

        <div className={data ? 'dataWrap' : 'dataWrap on'}>
          {data && data.length !== 0
            ? data.map((item, idx) => {
                return idx < 8 ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: item.sickNm }}
                    key={idx}
                  />
                ) : null;
              })
            : '검색어 없음'}
          <div className="upper"> </div>
          <div className="under"> </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
