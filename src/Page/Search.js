import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Search.scss';
import { debounce } from 'lodash';

const Search = () => {
  const [data, setData] = useState();
  const [inputText, setInputText] = useState();
  const [inform, setInform] = useState();
  const getdata = params => {
    axios
      .get(`http://localhost:4000/sick?q=${params}`)
      .then(respon => {
        if (respon.data.length === 0) {
          setInform(null);
        }
        bold(respon, params);
        console.info('calling api');
      })
      .catch(() => {
        console.log('fail');
      });
  };

  const bold = (respon, params) => {
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
  const change = debounce(e => {
    console.log(e.target.value.length);
    setInputText(e.target.value);

    if (e.target.value.length > 0) {
      let blank_pattern = /^\s+|\s+$/g;
      if (e.target.value.replace(blank_pattern, '') === '') {
        return false;
      }
      getdata(e.target.value);
      setInform('추천 검색어');
    } else {
      setData(null);
    }
  }, 500);

  const click = () => {
    console.log(2);
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
            onClick={click}
            onKeyUp={change}
          />
          <FontAwesomeIcon className="iconStyle" icon={faMagnifyingGlass} />
        </div>

        <div className={data ? 'dataWrap' : 'dataWrap on'}>
          <div className="upper">{inputText}</div>
          <div className="under">{inform}</div>
          {data && data.length !== 0
            ? data.map((item, idx) => {
                return idx < 5 ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: item.sickNm }}
                    key={idx}
                  />
                ) : null;
              })
            : ''}
        </div>
      </div>
    </div>
  );
};
export default Search;
