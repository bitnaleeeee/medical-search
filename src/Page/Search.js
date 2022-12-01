import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Search.scss';
import { debounce } from 'lodash';

const Search = () => {
  const [data, setData] = useState();
  const [inputText, setInputText] = useState();
  const [toggle, setToggle] = useState(false);

  const getdata = params => {
    axios
      .get(`http://localhost:4000/sick?q=${params}`)
      .then(respon => {
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
    } else {
      setData(null);
    }
  }, 500);

  const click = e => {
    if (e.target.className === 'inputBox') {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };
  return (
    <div className="searchWrap" onClick={click}>
      <div className="searchBox">
        <div className="title">
          국내 모든 임상시험 검색하고 <br />
          온라인으로 참여하기
        </div>
        <div className="inputWrap">
          <input
            className="inputBox"
            placeholder="질환명을 입력해주세요"
            onKeyUp={change}
          />
          <FontAwesomeIcon className="iconStyle" icon={faMagnifyingGlass} />
        </div>
        <div className={toggle ? 'dataWrap' : 'dataWrap hidden'}>
          <div className={data ? 'recommendArr hidden' : 'recommendArr'}>
            <div className="recommendText">추천검색어로 검색해보세요</div>
            {recommendArr.map((item, idx) => {
              return <span key={idx}>{item}</span>;
            })}
          </div>
          <div className="upper">{inputText}</div>
          <div className={data && data.length ? 'dataList' : 'dataList hidden'}>
            {console.log(data)}
            <div className="under">추천 검색어</div>
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
    </div>
  );
};

const recommendArr = ['B형 간염', '비만', '관절염', '우울증', '식도염'];

export default Search;
