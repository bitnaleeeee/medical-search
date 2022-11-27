import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import './Search.scss';

const Search = () => {
  const [data, setData] = useState();
  const getdata = () => {
    axios
      .get('http://localhost:4000/sick')
      .then(respon => {
        setData(respon.data);
        console.info('calling api');
      })
      .catch(() => {
        console.log('fail');
      });
  };

  const change = e => {
    if (e.target.value.length > 0) {
      getdata();
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
          <div className="upper"> </div>
          <div className="under"> </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
