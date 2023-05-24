import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Search.scss';
import { debounce } from 'lodash';

const recommendArr = ['B형 간염', '비만', '관절염', '우울증', '식도염'];
const Search = () => {
  const [keyword, setKeyword] = useState([]);
  const [inputText, setInputText] = useState('');
  const [toggle, setToggle] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  // 최근 검색어
  let recentStr = '';
  let recentArr = JSON.parse(localStorage.getItem('recentData')) || [];
  recentArr.reverse();

  /**
   * 질병 통신
   * @param {*} params 검색 키워드
   */
  const callData = params => {
    axios
      .get(`https://json-server-beryl.vercel.app/api/sick?q=${params}`)
      // .get(`http://localhost:4000/sick?q=${params}`)
      .then(respon => {
        console.log(respon);
        setHighlight(respon, params);
        console.info('Calling API');
      })
      .catch(() => {
        console.log('fail');
      });
  };

  /**
   * 검색어 하이라이트
   * @param {*} respon 검색 응답값
   * @param {*} params 검색 키워드
   */
  const setHighlight = (respon, params) => {
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
    setKeyword(newData);
  };

  /**
   * 검색어 변경
   * @param {*} e 이벤트 객체
   */
  const inputChange = e => {
    let str = e.target.value;
    setInputText(str);
    setData(str);
  };

  /**
   * 데이터 셋팅
   */
  const setData = str => {
    if (str.length > 0) {
      let blank_pattern = /^\s+|\s+$/g;
      if (str.replace(blank_pattern, '') === '') {
        return false;
      }
      callData(str);

      // let blank_pattern = /^\s+|\s+$/g;
      // if (e.target.value.replace(blank_pattern, '') === '') {
      //   return false;
      // }
      // if (e.keyCode !== 40 && e.keyCode !== 38) {
      //   callData(e.target.value);
      // }
    } else {
      setKeyword(null);
    }
  };

  // /**
  //  * 데이터 셋팅
  //  */
  // const setData = debounce(str => {
  //   if (str.length > 0) {
  //     let blank_pattern = /^\s+|\s+$/g;
  //     if (str.replace(blank_pattern, '') === '') {
  //       return false;
  //     }
  //     callData(str);

  //     // let blank_pattern = /^\s+|\s+$/g;
  //     // if (e.target.value.replace(blank_pattern, '') === '') {
  //     //   return false;
  //     // }
  //     // if (e.keyCode !== 40 && e.keyCode !== 38) {
  //     //   callData(e.target.value);
  //     // }
  //   } else {
  //     setKeyword(null);
  //   }
  // }, 500);

  /**
   * 검색 박스 보이기
   * @param {*} e 이벤트 객체
   */
  const showBox = e => {
    // setToggle(true);
    if (e.target.className === 'inputBox') {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  // const keyDown = e => {
  //   if (e.keyCode === 40) {
  //     setTabIndex(tabIndex + 1);
  //     if (tabIndex === 5) {
  //       setTabIndex(0);
  //     }
  //   } else if (e.keyCode === 38) {
  //     setTabIndex(tabIndex - 1);
  //     if (tabIndex === 0) {
  //       setTabIndex(5);
  //     }
  //   }
  // };

  /**
   * 검색 버튼 클릭
   * @param {*} e
   * @returns
   */
  const searchBtnClick = e => {
    let str = inputText;
    if (str === '') {
      return;
    }

    setInputText('');
    setData('');
    recentArr.push(str);
    recentStr = JSON.stringify(recentArr);
    localStorage.setItem('recentData', recentStr);
  };

  /**
   * 검색 키워드 아이템 클릭
   * @param {*} e
   */
  const clickKeywordItem = e => {
    let str = e.target.innerText;
    setInputText(str);
    setData(str);
  };

  return (
    <div className="searchWrap" onClick={showBox}>
      <div className="searchBox">
        <div className="title">
          {/* 국내 모든 임상시험 검색하고 <br />
          온라인으로 참여하기 */}
        </div>

        {/* 입력 영역 */}
        <div className="inputWrap">
          <FontAwesomeIcon className="iconSearch" icon={faMagnifyingGlass} />
          <input
            type="text"
            className="inputBox"
            placeholder="질환명을 입력해주세요"
            onChange={inputChange}
            // onKeyDown={keyDown}
            // defaultValue={inputText}
            value={inputText}
          />
          <button type="button" className="searchBtn" onClick={searchBtnClick}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>

        {/* 결과 영역 */}
        <div className={toggle ? 'infoWrap' : 'infoWrap hidden'}>
          <div className="infoInner">
            {/* 최근 검색어 */}
            <div
              className={
                keyword && keyword.length ? 'recentWrap hidden' : 'recentWrap'
              }
            >
              <div className="recentTitle">최근 검색어</div>
              {recentArr &&
                recentArr.map((item, idx) => {
                  if (item && idx < 5) {
                    return (
                      <div
                        key={idx}
                        className="item"
                        onClick={clickKeywordItem}
                      >
                        <FontAwesomeIcon
                          className="icon"
                          icon={faMagnifyingGlass}
                        />
                        <span className="text">{item}</span>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
            </div>

            {/* 추천 검색어 */}
            <div
              className={
                keyword && keyword.length
                  ? 'recommendWrap hidden'
                  : 'recommendWrap'
              }
            >
              <div className="recommendTitle">추천검색어로 검색해보세요</div>
              <div className="recommendList">
                {recommendArr.map((item, idx) => {
                  return (
                    <button type="button" key={idx} onClick={clickKeywordItem}>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 현재 검색어 */}
            <div
              className={
                keyword && keyword.length
                  ? 'recentSearchText'
                  : 'recentSearchText hidden'
              }
            >
              <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
              <span className="text">{inputText}</span>
            </div>
            {/* 검색 결과 */}
            <div
              className={
                keyword && keyword.length
                  ? 'searchResultList'
                  : 'searchResultList hidden'
              }
            >
              <div className="searchResultTitle">추천 검색어</div>
              {keyword && keyword.length !== 0
                ? keyword.map((item, idx) => {
                    return idx < 5 ? (
                      <div
                        className="item"
                        key={idx}
                        onClick={clickKeywordItem}
                      >
                        <FontAwesomeIcon
                          className="icon"
                          icon={faMagnifyingGlass}
                        />
                        <span
                          className={idx === tabIndex ? ' on' : null}
                          dangerouslySetInnerHTML={{ __html: item.sickNm }}
                          key={idx}
                        />
                      </div>
                    ) : null;
                  })
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
