import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import './Search.scss';

const Search = () => {
  return (
    <div className="searchWrap">
      <div className="searchBox">
        <div className="title">
          국내 모든 임상시험 검색하고 <br />
          온라인으로 참여하기
        </div>
        <div className="inputWrap">
          <input className="inputBox" placeholder="질환명을 입력해주세요" />
          <FontAwesomeIcon className="iconStyle" icon={faMagnifyingGlass} />
        </div>
      </div>
    </div>
  );
};
export default Search;
